from django.shortcuts import get_object_or_404
from rest_framework import viewsets, mixins, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes, OpenApiResponse
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.pagination import LimitOffsetPagination
from offers.models import Offers
from ..models import Reservations, ReservationStatus
from ..serializers import ReservationSerializer, ReservationInfoSerializer, ReservationListFilterSerializer, \
    ReservationCreateSerializer, ReservationFullInfoSerializer
from ..permissions import CanAccessReservation
import calendar
from datetime import date
from datetime import timedelta
from notifications.tasks import send_template_email
from django.conf import settings

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
        'info': ReservationFullInfoSerializer,
        'landlord': ReservationInfoSerializer,
        'landlord_retrieve': ReservationSerializer,
        'make_reservation': ReservationCreateSerializer,
    }

    def get_serializer_class(self):
        return self.serializer_action_classes.get(self.action, self.serializer_class)

    def get_queryset(self):
        user = self.request.user
        qureyset = Reservations.objects.all()
        if user.role != user.ROLE_ADMIN:
            qureyset = qureyset.filter(user=user)
        return qureyset

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
    def list(self, request):

        filter_serializer = ReservationListFilterSerializer(data=request.query_params)
        filter_serializer.is_valid(raise_exception=True)
        params = filter_serializer.validated_data

        confirmed = ReservationStatus.objects.get(name='confirmed')
        queryset = self.get_queryset().filter(status_id=confirmed)

        today = timezone.localdate()

        timeframe = params.get('timeframe', 'upcoming')
        if timeframe == 'upcoming':
            queryset = queryset.filter(end_date__gte=today)
        elif timeframe == 'past':
            queryset = queryset.filter(end_date__lt=today)

        if date_from := params.get('date_from'):
            queryset = queryset.filter(end_date__gte=date_from)
        if date_to := params.get('date_to'):
            queryset = queryset.filter(start_date__lte=date_to)
        if status_name := params.get('status'):
            queryset = queryset.filter(status_id__name__iexact=status_name)

        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    #TODO NIE DIZLAA
    @extend_schema(
        summary="Retrieve a full reservation info",
        description="Retrieves **full** reservation data.",
        responses={200: ReservationSerializer()},
    )
    def retrieve(self, request, pk=None):
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
        parameters=[
            OpenApiParameter(
                name='offer_pk',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the offer to book",
                required=True
            ),
            OpenApiParameter(
                name='start_date',
                type=OpenApiTypes.DATE,
                description="Start date of the reservation (YYYY-MM-DD)",
                required=True
            ),
            OpenApiParameter(
                name='end_date',
                type=OpenApiTypes.DATE,
                description="End date of the reservation (YYYY-MM-DD)",
                required=True
            ),
            OpenApiParameter(
                name='guests_number',
                type=OpenApiTypes.INT,
                description="Number of guests",
                required=True
            )
        ],
    )
    @action(detail=False, methods=['post'], url_path='make-reservation')
    def make_reservation(self, request, offer_pk=None):
        user = request.user

        if user.role == User.ROLE_ADMIN:
            return Response(
                {"detail": "Admins are not allowed to create reservations."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(
            data=request.data,
            context={'request': request, 'view': self}
        )
        serializer.is_valid(raise_exception=True)

        reservation = serializer.save()

        send_template_email.delay(
            to_email=reservation.user.email,
            template_id=settings.BREVO_RESERVATION_CONFIRM_TEMPLATE_ID,
            merge_data={
                "first_name": reservation.user.first_name,
                "reservation_id": reservation.pk,
                "title": reservation.offer_id.title,
                "city": reservation.offer_id.offerlocation.city,
                "country": reservation.offer_id.offerlocation.country,
                "checkin_date": reservation.start_date.isoformat(),
                "checkout_date": reservation.end_date.isoformat(),
            }
        )

        return Response(
            ReservationSerializer(reservation).data,
            status=status.HTTP_201_CREATED
        )

    @extend_schema(
        summary="Retrieve unavailable dates for an offer in particular month",
        description=(
                "Returns a list containing **only** unavailable dates, "
                "in particular selected month. "
        ),
        parameters=[
            OpenApiParameter(
                name='month',
                type=OpenApiTypes.INT,
                description="index of month to check (1-12)",
                required=True
            ),
            OpenApiParameter(
                name='year',
                type=OpenApiTypes.INT,
                description="year eg. 2025",
                required=True
            ),

        ],
        responses={200: OpenApiResponse(description="List of unavailable dates as strings")}
    )
    @action(detail=False, methods=['get'], url_path=r'(?P<offer_id>\d+)/unavailable-dates', permission_classes=[AllowAny])
    def unavailable_dates(self, request, offer_id=None):
        offer = get_object_or_404(Offers, pk=offer_id)
        confirmed = ReservationStatus.objects.get(name='confirmed')
        try:
            year = int(request.query_params['year'])
            month = int(request.query_params['month'])
            if not 1 <= month <= 12:
                raise ValueError
        except (ValueError, KeyError):
            return Response(
                {"detail": "Both 'year' (int) and 'month' (1–12) are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        first_day = date(year, month, 1)
        last_day = date(year, month, calendar.monthrange(year, month)[1])

        reservations = Reservations.objects.filter(
            offer_id=offer,
            start_date__gte=first_day,
            end_date__lte=last_day,
            status_id=confirmed
        )

        unavailable_dates = set()
        for reservation in reservations:
            start_date = reservation.start_date
            end_date = reservation.end_date
            while start_date <= end_date:
                unavailable_dates.add(start_date.strftime('%Y-%m-%d'))
                start_date += timedelta(days=1)


        result = sorted(unavailable_dates)
        return Response(
            result,
            status=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Retrieve unavailable dates for an offer in particular month",
        description=(
                "Returns a list containing **only** unavailable dates, "
                "in particular selected month. "
        ),
        parameters=[
            OpenApiParameter(
                name='month',
                type=OpenApiTypes.INT,
                description="index of month to check (1-12)",
                required=True
            ),
            OpenApiParameter(
                name='year',
                type=OpenApiTypes.INT,
                description="year eg. 2025",
                required=True
            ),

        ],
        responses={200: OpenApiResponse(description="List of unavailable dates as strings")}
    )
    @action(detail=False, methods=['get'], url_path=r'(?P<offer_id>\d+)/unavailable-dates',
            permission_classes=[AllowAny])
    def unavailable_dates(self, request, offer_id=None):
        offer = get_object_or_404(Offers, pk=offer_id)
        confirmed = ReservationStatus.objects.get(name='confirmed')
        try:
            year = int(request.query_params['year'])
            month = int(request.query_params['month'])
            if not 1 <= month <= 12:
                raise ValueError
        except (ValueError, KeyError):
            return Response(
                {"detail": "Both 'year' (int) and 'month' (1–12) are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        first_day = date(year, month, 1)
        last_day = date(year, month, calendar.monthrange(year, month)[1])

        reservations = Reservations.objects.filter(
            offer_id=offer,
            start_date__gte=first_day,
            end_date__lte=last_day,
            status_id=confirmed
        )

        unavailable_dates = set()
        for reservation in reservations:
            start_date = reservation.start_date
            end_date = reservation.end_date
            while start_date <= end_date:
                unavailable_dates.add(start_date.strftime('%Y-%m-%d'))
                start_date += timedelta(days=1)

        result = sorted(unavailable_dates)
        return Response(
            result,
            status=status.HTTP_200_OK
        )







