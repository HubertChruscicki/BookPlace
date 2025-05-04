from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiResponse
from rest_framework.viewsets import ReadOnlyModelViewSet
from ..models import Offers, OfferImages
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny
from rest_framework import generics
from rest_framework.pagination import LimitOffsetPagination

from ..serializers import (
    OffersSerializer,
    CreateOfferSerializer,
    OfferCardSerializer
)

class OfferCardPagination(LimitOffsetPagination):
    default_limit = 20
    max_limit = 100


@action(
    detail=False,
    methods=['post'],
    url_path='add-offer',
    parser_classes=[MultiPartParser, FormParser]
)
def add_offer(self, request):
    ...

class OfferViewAPI(ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    serializer_class  = OffersSerializer
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
    @action (detail=False, methods=['post'], url_path='add-offer') #TODO DODAC OPIS IMAGE MA BYC BASE 64
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

    @extend_schema(
        summary="List offer cards (quick load)",
        description="""
               Retrieve a paginated list of offer cards in the format:
               Supports offset/limit and filters on beds, guests, all amenities, city, country.
           """,
        parameters=[
            OpenApiParameter("offset", type=int, description="Offset"),
            OpenApiParameter("limit", type=int, description="Max items"),
            OpenApiParameter("min_beds", type=int, description="Min beds"),
            OpenApiParameter("max_beds", type=int, description="Max beds"),
            OpenApiParameter("min_guests", type=int, description="Min guests"),
            OpenApiParameter("max_guests", type=int, description="Max guests"),
            OpenApiParameter("private_bathroom", type=bool, description="Filter by private bathroom"),
            OpenApiParameter("kitchen", type=bool, description="Filter by kitchen"),
            OpenApiParameter("wifi", type=bool, description="Filter by wifi"),
            OpenApiParameter("tv", type=bool, description="Filter by TV"),
            OpenApiParameter("fridge_in_room", type=bool, description="Filter by fridge"),
            OpenApiParameter("air_conditioning", type=bool, description="Filter by A/C"),
            OpenApiParameter("smoking_allowed", type=bool, description="Filter by smoking allowed"),
            OpenApiParameter("pets_allowed", type=bool, description="Filter by pets allowed"),
            OpenApiParameter("parking", type=bool, description="Filter by parking"),
            OpenApiParameter("swimming_pool", type=bool, description="Filter by pool"),
            OpenApiParameter("sauna", type=bool, description="Filter by sauna"),
            OpenApiParameter("jacuzzi", type=bool, description="Filter by jacuzzi"),
            OpenApiParameter("city", type=str, description="Filter by city"),
            OpenApiParameter("country", type=str, description="Filter by country"),
        ],
        responses={200: OpenApiResponse(response=OfferCardSerializer(many=True))}
    )
    @action(detail=False, methods=['get'], url_path='load-offers',
            pagination_class=OfferCardPagination)
    def cards(self, request):
        qs = Offers.objects.filter(is_active=True)
        params = request.query_params

        # beds
        if params.get('min_beds') is not None:
            qs = qs.filter(offerdetails__beds__gte=int(params['min_beds']))
        if params.get('max_beds') is not None:
            qs = qs.filter(offerdetails__beds__lte=int(params['max_beds']))

        # guests
        if params.get('min_guests') is not None:
            qs = qs.filter(max_guests__gte=int(params['min_guests']))
        if params.get('max_guests') is not None:
            qs = qs.filter(max_guests__lte=int(params['max_guests']))

        for field in [
            'private_bathroom', 'kitchen', 'wifi', 'tv',
            'fridge_in_room', 'air_conditioning', 'smoking_allowed',
            'pets_allowed', 'parking', 'swimming_pool', 'sauna', 'jacuzzi'
        ]:
            v = params.get(field)
            if v is not None:
                flag = v.lower() in ['1', 'true', 'yes']
                qs = qs.filter(**{f'offeramenities__{field}': flag})

        if params.get('city'):
            qs = qs.filter(offerlocation__city__iexact=params['city'])
        if params.get('country'):
            qs = qs.filter(offerlocation__country__iexact=params['country'])

        page = self.paginate_queryset(qs)
        serializer = OfferCardSerializer(page, many=True, context={'request': request})
        return self.get_paginated_response(serializer.data)



