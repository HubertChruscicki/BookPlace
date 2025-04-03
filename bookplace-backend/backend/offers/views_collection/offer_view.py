from ..models import Offers
from ..serializers import OffersSerializer, OfferDetailsSerializer, OfferLocationSerializer, OfferImagesSerializer, LandlordBasicSerializer, FullOfferCreateSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import NotFound
from django.http import Http404
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status


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


    @action(detail=False, methods=["post"], url_path="add-offer")
    def add_offer(self, request):
        serializer = FullOfferCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        validated_data = serializer.validated_data

        details_data = validated_data.pop('details')
        location_data = validated_data.pop('location')
        images_data = validated_data.pop('images')
        offer_types_data = validated_data.pop('offer_types')
        landlord_id = 1
        offer = Offers.objects.create(landlord_id=landlord_id, **validated_data)

        for idx, img_data in enumarate(images_data):
            OfferImages.objects.create(
                offer_id=offer,
                path=img_data['path'],
                is_main=(idx == 0)
            )

        return Response({
            "id": offer.id,
            "message": "Offer created successfully"
        }, status=status.HTTP_201_CREATED)