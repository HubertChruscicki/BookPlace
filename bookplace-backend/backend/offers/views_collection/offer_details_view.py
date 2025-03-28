from ..models import Offers, OfferDetails
from ..serializers import OffersSerializer, OfferDetailsSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import NotFound
from django.http import Http404

class OfferDetailsViewAPI(ModelViewSet):
    serializer_class = OfferDetailsSerializer
    def get_queryset(self):
        return OfferDetails.objects.all()

    def get_object(self):
        try:
            return super().get_object()
        except Http404:
            raise NotFound(detail="Offer deosnt exist or doesnt have provided details.")

