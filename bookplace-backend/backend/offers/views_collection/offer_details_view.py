from ..models import Offers, OfferDetails
from ..serializers import OffersSerializer, OfferDetailsSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import NotFound
from django.http import Http404
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models
from rest_framework.permissions import AllowAny



class OfferDetailsViewAPI(ModelViewSet):
    serializer_class = OfferDetailsSerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        return OfferDetails.objects.all()

    def get_object(self):
        try:
            return super().get_object()
        except Http404:
            raise NotFound(detail="Offer deosnt exist or doesnt have provided details.")

    @action(detail=False, methods=["get"], url_path="amenities-keys")
    def get_feature_keys(self, request):
        boolean_fields = [
            field.name for field in OfferDetails._meta.fields
            if isinstance(field, models.BooleanField)
        ]
        return Response(boolean_fields)
