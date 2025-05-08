from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_date
from rest_framework import viewsets, mixins, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes, OpenApiResponse
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.pagination import LimitOffsetPagination

from offers.models import Offers
from ..models import Reservations, ReservationStatus
from ..serializers import ReservationSerializer, ReservationInfoSerializer, ReservationListFilterSerializer, ReservationCreateSerializer
from ..permissions import CanAccessReservation

User = get_user_model()

class ReservationPagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 100

class ReservationViewAPI(
        mixins.ListModelMixin,
        mixins.RetrieveModelMixin,
        viewsets.GenericViewSet
    ):

    pagination_class = ReservationPagination

    permission_classes = [IsAuthenticated, CanAccessReservation]

    serializer_class = ReservationSerializer

    serializer_action_classes = {
        'list': ReservationInfoSerializer,
        'info': ReservationInfoSerializer,
        'landlord': ReservationInfoSerializer,
        'landlord_retrieve': ReservationSerializer,
        'make_reservation': ReservationCreateSerializer,
        'landlord_retrieve': ReservationSerializer,
    }

    def get_serializer_class(self):
        return self.serializer_action_classes.get(self.action, self.serializer_class)

    def get_queryset(self):
        offer_pk = self.kwargs['offer_pk']
        user = self.request.user

        base_queryset = Reservations.objects.filter(offer_id=offer_pk)

        if user.role == user.ROLE_ADMIN:
            queryset = base_queryset
        else:
            queryset = base_queryset.filter(user=user)

        return queryset

    @extend_schema(
        summary="List of reservations minimal info",
        description=(
            "Returns list that contains **only** id, start/end dates, and status name "
            "for confirmed & upcoming reservations — or past/all when you specify timeframe"
        ),
        parameters=[
            OpenApiParameter(
                name='timeframe',
                enum=['upcoming', 'past', 'all'],
                description="Which dates to include: upcoming | past | all",
                required=False,
                default='upcoming',
            ),
            OpenApiParameter(
                name='date_from',
                description="Filter: end_date ≥ date_from",
                required=False,
            ),
            OpenApiParameter(
                name='date_to',
                description="Filter: start_date ≤ date_to",
                required=False,
            ),
            OpenApiParameter(
                name='status',
                description="Filter by status name",
                required=False,
            ),
        ],
        responses={200: ReservationInfoSerializer(many=True)},
    )
    def list(self, request, offer_pk=None):

        filter_serializer = ReservationListFilterSerializer(data=request.query_params)
        filter_serializer.is_valid(raise_exception=True)
        params = filter_serializer.validated_data

        confirmed = ReservationStatus.objects.get(name='confirmed')
        queryset = self.get_queryset().filter(status_id=confirmed)

        today = timezone.localdate()

        timeframe = params.get('timeframe', 'upcoming')
        if timeframe == 'upcoming':
            queryset = queryset.filter(end_date__date__gte=today)
        elif timeframe == 'past':
            queryset = queryset.filter(end_date__date__lt=today)

        if date_from := params.get('date_from'):
            queryset = queryset.filter(end_date__date__gte=date_from)
        if date_to := params.get('date_to'):
            queryset = queryset.filter(start_date__date__lte=date_to)
        if status_name := params.get('status'):
            queryset = queryset.filter(status_id__name__iexact=status_name)

        page = self.paginate_queryset(queryset)
        return self.get_paginated_response(
            ReservationInfoSerializer(page, many=True).data
        )

    @extend_schema(
        summary="Retrieve a full reservation info",
        description="Retrieves **full** reservation data.",
        responses={200: ReservationSerializer()},
    )
    def retrieve(self, request, offer_pk=None, pk=None):
        obj = get_object_or_404(self.get_queryset(), pk=pk)
        self.check_object_permissions(request, obj)
        return Response(self.get_serializer(obj).data, status=status.HTTP_200_OK)


    @extend_schema(
        summary="Retrieve minimal reservation info",
        description="Retrieves only: `id`, `start_date`, `end_date` i `status`.",
        responses={200: ReservationInfoSerializer()},
    )
    @action(detail=True, methods=['get'], url_path='info')
    def info(self, request, offer_pk=None, pk=None):
        obj = get_object_or_404(self.get_queryset(), pk=pk)
        self.check_object_permissions(request, obj)
        return Response(self.get_serializer(obj).data, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Retrieve landlord’s reservations minimal info",
        description=(
                "Returns a paginated list containing **only** id, start/end dates, and status name "
                "for reservations on offers owned by the requesting landlord. Supports the same filters "
                "as the guest list endpoint plus pagination."
        ),
        parameters=[
            OpenApiParameter(
                name='timeframe',
                enum=['upcoming', 'past', 'all'],
                description="Which dates to include: upcoming | past | all",
                required=False,
                default='upcoming',
            ),
            OpenApiParameter(
                name='date_from',
                description="Filter: end_date ≥ date_from (YYYY-MM-DD)",
                required=False,
            ),
            OpenApiParameter(
                name='date_to',
                description="Filter: start_date ≤ date_to (YYYY-MM-DD)",
                required=False,
            ),
            OpenApiParameter(
                name='status',
                description="Filter by status name (case-insensitive)",
                required=False,
            ),
            OpenApiParameter(
                name='limit',
                description="Maximum number of results to return",
                required=False,
            ),
            OpenApiParameter(
                name='offset',
                description="Index of the first result to return",
                required=False,
            )
        ],
        responses={200: ReservationInfoSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], url_path='landlord', pagination_class=ReservationPagination)
    def landlord(self, request, offer_pk=None):

        filter_serializer = ReservationListFilterSerializer(data=request.query_params)
        filter_serializer.is_valid(raise_exception=True)
        params = filter_serializer.validated_data

        queryset = Reservations.objects.filter(offer_id__landlord=request.user)

        confirmed = ReservationStatus.objects.get(name='confirmed')
        queryset = queryset.upcoming().filter(status_id=confirmed)

        today = timezone.localdate()
        timeframe = params.get('timeframe', 'upcoming')
        if timeframe == 'upcoming':
            queryset = queryset.filter(end_date__date__gte=today)
        elif timeframe == 'past':
            queryset = queryset.filter(end_date__date__lt=today)

        if date_from := params.get('date_from'):
            queryset = queryset.filter(end_date__date__gte=date_from)
        if date_to := params.get('date_to'):
            queryset = queryset.filter(start_date__date__lte=date_to)

        if status_name := params.get('status'):
            queryset = queryset.filter(status_id__name__iexact=status_name)

        page = self.paginate_queryset(queryset)
        return self.get_paginated_response(
            ReservationInfoSerializer(page, many=True).data
        )

    @extend_schema(
        summary="Landlord: retrieve full info for one reservation",
        responses={200: ReservationSerializer(), 404: OpenApiResponse(description="Not found")},
    )
    @action(
        detail=False,
        methods=['get'],
        url_path=r'landlord/(?P<pk>\d+)'
    )
    def landlord_retrieve(self, request, pk=None):
        confirmed = get_object_or_404(ReservationStatus, name='confirmed')
        queryset = Reservations.objects.filter(
            offer_id__landlord=request.user,
            status_id=confirmed
        )
        reservation = get_object_or_404(queryset, pk=pk)
        return Response(ReservationSerializer(reservation).data)



#TODO THINK ABOUT PENDING PAYMENT ETC.
    @extend_schema(
        summary="Make a new reservation",
        description=(
                "Creates a new reservation with status `confirmed`."
                " **Admins** may not create reservations."
                " **Landlords** cant book their own offers."
        ),
        request=ReservationCreateSerializer,
        responses={
            201: ReservationSerializer,
            403: OpenApiResponse(description="Forbidden"),
            400: OpenApiResponse(description="Validation error"),
        },
    )
    @action(detail=False, methods=['post'], url_path='make-reservation')
    def make_reservation(self, request, offer_pk=None):
        user = request.user

        if user.role == User.ROLE_ADMIN:
            return Response(
                {"detail": "Admins are not allowed to create reservations."},
                status=status.HTTP_403_FORBIDDEN
            )

        if user.role == User.ROLE_LANDLORD:
            offer = get_object_or_404(Offers, pk=offer_pk)
            if getattr(offer, 'landlord', None) == user.id:
                return Response(
                    {"detail": "You cannot make a reservation on your own offer."},
                    status=status.HTTP_403_FORBIDDEN
                )

        serializer = self.get_serializer(
            data=request.data,
            context={'request': request, 'view': self}
        )
        serializer.is_valid(raise_exception=True)

        reservation = serializer.save()
        out_ser = ReservationSerializer(reservation)
        return Response(out_ser.data, status=status.HTTP_201_CREATED)