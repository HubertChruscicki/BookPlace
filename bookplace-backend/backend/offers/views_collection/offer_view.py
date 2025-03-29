from ..models import Offers
from ..serializers import OffersSerializer, OfferDetailsSerializer, OfferLocationSerializer, OfferImagesSerializer, LandlordBasicSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import NotFound
from django.http import Http404
from rest_framework.response import Response


class OfferViewAPI(ModelViewSet):
    serializer_class = OffersSerializer
    def get_queryset(self):
        return Offers.objects.filter(is_active=True)

    def retrieve(self, request, *args, **kwargs):
        offer = self.get_object()
        offer_data = OffersSerializer(offer).data

        offer_data['landlord_id'] = LandlordBasicSerializer(offer.landlord_id).data
        offer_data['details'] = OfferDetailsSerializer(getattr(offer, 'offerdetails', None)).data
        offer_data['location'] = OfferLocationSerializer(getattr(offer, 'offerlocation', None)).data
        offer_data['images'] = OfferImagesSerializer(offer.offerimages_set.all(), many=True).data

        return Response(offer_data)
    def get_object(self):
        try:
            return super().get_object()
        except Http404:
            raise NotFound(detail="Such offer doesnt exist.")




