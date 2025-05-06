from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_date
from rest_framework import viewsets, mixins, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from django.db.models import Q

from ..models import Reservations, ReservationStatus
from ..serializers import ReservationSerializer, ReservationInfoSerializer
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
        elif user.role == user.ROLE_LANDLORD:
            queryset = base_queryset.filter(
                Q(user=user) | Q(offer_id__owner=user)
            )
        else:
            queryset = base_queryset.filter(user=user)

        if self.action == 'list':
            confirmed = ReservationStatus.objects.get(name='confirmed')
            queryset = queryset.upcoming().filter(status_id=confirmed)
        return queryset

    @extend_schema(
        summary="List reservations minimal info for an offer",
        description=(
            "Returns list that contains "
            " **only** id, start/end dates, and status name "
            "for confirmed & upcoming reservations"
        ),
        parameters=[
            OpenApiParameter("date_from", OpenApiTypes.DATE, description="`end_date` ≥ date_from"),
            OpenApiParameter("date_to", OpenApiTypes.DATE, description="`start_date` ≤ date_to"),
            OpenApiParameter("status", OpenApiTypes.STR,  description="Filter by status name"),
        ],
        responses={200: ReservationSerializer(many=True)},
    )
    def list(self, request, offer_pk=None):
        queryset = self.get_queryset()

        if date_from := parse_date(request.query_params.get('date_from') or ''):
            queryset = queryset.filter(end_date__date__gte=date_from)
        if date_to := parse_date(request.query_params.get('date_to') or ''):
            queryset = queryset.filter(start_date__date__lte=date_to)
        if status_name := request.query_params.get('status'):
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

