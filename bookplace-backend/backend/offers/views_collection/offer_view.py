from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiResponse
from rest_framework.viewsets import ReadOnlyModelViewSet
from ..models import Offers, OfferImages
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser

from ..serializers import (
    OffersSerializer,
    CreateOfferSerializer
)

@action(
    detail=False,
    methods=['post'],
    url_path='add-offer',
    parser_classes=[MultiPartParser, FormParser]
)
def add_offer(self, request):
    ...

class OfferViewAPI(ReadOnlyModelViewSet):
    serializer_class  = OffersSerializer
    #permision_classes TODO
    def get_queryset(self):
        return Offers.objects.all()

    @extend_schema(
        summary="List all offers",
        description="Retrieve a list of offers",
        responses={200: OpenApiResponse(response=OffersSerializer(many=True))}
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


    @extend_schema(
        summary="Retrieve a single offer",
        description="Fetch details of a specific offer by its ID",
        responses={
            200: OpenApiResponse(response=OffersSerializer),
            404: OpenApiResponse(description="Offer not found"),
        }
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        summary="Create a new offer",
        request=CreateOfferSerializer,
        responses={
            201: OpenApiResponse(response=CreateOfferSerializer),
            400: OpenApiResponse(description="Validation errors"),
        }
    )
    @action (detail=False, methods=['post'], url_path='add-offer')
    def add_offer(self, request):
        """
        #### Example Request:
        ```
        POST /api/v1/offers/add-offer/
        ```
        """
        serializer = CreateOfferSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'], url_path=r'remove-offer/(?P<offer_id>\d+)')
    def remove_offer(self, request, offer_id=None):
        """
        #### Example Request:
        ```
        DELETE /api/v1/offers/remove-offer/?offer_id=77
        ```
        """
        try:
            offer = Offers.objects.get(id=offer_id)
        except Offers.DoesNotExist:
            raise NotFound(detail="Offer does not exist. Cannot delete it.")
        offer.delete()
        return Response({"message": "Offer deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


