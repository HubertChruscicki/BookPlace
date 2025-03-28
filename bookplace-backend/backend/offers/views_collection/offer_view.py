from ..models import Offers
from ..serializers import OffersSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import NotFound
from django.http import Http404


class OfferViewAPI(ModelViewSet):
    serializer_class = OffersSerializer
    def get_queryset(self):
        return Offers.objects.filter(is_active=True)

    def get_object(self):
        try:
            return super().get_object()
        except Http404:
            raise NotFound(detail="Such offer doesnt exist.")




