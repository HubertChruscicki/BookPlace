from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_date
from rest_framework import viewsets, mixins, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from django.utils import timezone


from ..models import Reservations, ReservationStatus
from ..serializers import ReservationSerializer, ReservationInfoSerializer, ReservationListFilterSerializer
from ..permissions import CanAccessReservation

class ReservationViewAPI(
        mixins.ListModelMixin,
        mixins.RetrieveModelMixin,
        viewsets.GenericViewSet
    ):

    permission_classes = [IsAuthenticated, CanAccessReservation]

    def get_serializer_class(self):
        if self.action in ('list', 'info'):
            return ReservationInfoSerializer
        return ReservationSerializer

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
        responses={200: ReservationSerializer(many=True)},
    )
    def list(self, request, offer_pk=None):

        filter_serializer = ReservationListFilterSerializer(data=request.query_params)
        filter_serializer.is_valid(raise_exception=True)
        params = filter_serializer.validated_data

        confirmed = ReservationStatus.objects.get(name='confirmed')
        queryset = self.get_queryset().filter(status_id=confirmed)

        today = timezone.localdate()

        if date_from := params.get('date_from'):
            queryset = queryset.filter(end_date__date__gte=date_from)
        if date_to := params.get('date_to'):
            queryset = queryset.filter(start_date__date__lte=date_to)
        if status_name := params.get('status'):
            queryset = queryset.filter(status_id__name__iexact=status_name)

        return Response(self.get_serializer(queryset, many=True).data, status=status.HTTP_200_OK)

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
        summary="Retrieve reservations of landlords offers ",
        description="Retrieves only: `id`, `start_date`, `end_date` i `status`.",
        responses={200: ReservationInfoSerializer()},
    )
    @action(detail=False, methods=['get'], url_path='landlord')
    def landlord(self, request, offer_pk=None):
        user = request.user

        queryset = Reservations.objects.filter(
            offer_id__owner=user
        )

        confirmed = ReservationStatus.objects.get(name='confirmed')
        queryset = queryset.upcoming().filter(status_id=confirmed)

        serializer = ReservationInfoSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

