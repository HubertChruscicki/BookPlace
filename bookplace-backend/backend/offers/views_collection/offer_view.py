from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiResponse
from rest_framework.viewsets import ReadOnlyModelViewSet
from ..models import Offers, OfferImages, OfferTypes
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from users.permissions import IsLandlord
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.exceptions import ParseError
import logging
from users.authentication     import JWTAuthentication


from ..serializers import (
    OffersSerializer,
    CreateOfferSerializer,
    OfferCardSerializer
)

class OfferCardPagination(LimitOffsetPagination):
    default_limit = 48
    max_limit = 100


logger = logging.getLogger(__name__) #todo delete


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
        },

    )
    @action(
        detail=False,
        methods=['post'],
        url_path='add-offer',
        parser_classes=[MultiPartParser, FormParser],
        authentication_classes=[JWTAuthentication],  # (opcjonalnie, jeśli chcesz nadpisać domyślne)
        permission_classes=[IsAuthenticated, IsLandlord],  # << tutaj
    )
    #TODO DODAC OPIS IMAGE MA BYC BASE 64
    def add_offer(self, request):
        """
        #### Example Request:
        ```
        POST /api/v1/offers/add-offer/
        ```
        """

        #TODO DELETE
        logger.debug("Headers: %s", dict(request.headers))
        # pokaż body JSON / form-data
        logger.debug("Body data: %s", request.data)
        # pokaż user / token
        logger.debug("User: %s, Auth: %s", request.user, request.auth)



        serializer = CreateOfferSerializer(data=request.data, context={'request': request})
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
            OpenApiParameter("type", type=int, description="Filter by offer type ID"),
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
    @action(detail=False, methods=['get'], url_path='load-offers', pagination_class=OfferCardPagination)
    def load(self, request):
        queryset = Offers.objects.filter(is_active=True)
        params = request.query_params
        def get_int(name):
            field_value = params.get(name)
            if field_value is None:
                return None
            try:
                return int(field_value)
            except ValueError:
                raise ParseError({name: f"{field_value}Must be an integer"})
        def get_bool(name):
            field_value = params.get(name)
            if field_value is None:
                return None
            lower_case_value = field_value.lower()
            if lower_case_value in ('1', 'true', 'yes'):
                return True
            if lower_case_value in ('0', 'false', 'no'):
                return False
            raise ParseError({name: f"{field_value}Must be an boolean"})

        type_id = get_int('type')
        if type_id is not None:
            if not OfferTypes.objects.filter(id=type_id).exists():
                raise ParseError({'type': f"Offer with type {type_id} id does not exist"})
            queryset = queryset.filter(offer_type__id=type_id)

        min_beds = get_int('min_beds')
        if min_beds is not None:
            queryset = queryset.filter(offerdetails__beds__gte=min_beds)
        max_beds = get_int('max_beds')
        if max_beds is not None:
            queryset = queryset.filter(offerdetails__beds__lte=max_beds)

        min_guests = get_int('min_guests')
        if min_guests is not None:
            queryset = queryset.filter(max_guests__gte=min_guests)
        max_guests = get_int('max_guests')
        if max_guests is not None:
            queryset = queryset.filter(max_guests__lte=max_guests)

        for field in [
            'private_bathroom', 'kitchen', 'wifi', 'tv',
            'fridge_in_room', 'air_conditioning', 'smoking_allowed',
            'pets_allowed', 'parking', 'swimming_pool', 'sauna', 'jacuzzi'
        ]:
            flag = get_bool(field)
            if flag is not None:
                queryset = queryset.filter(**{f'offeramenities__{field}': flag})

        city = params.get('city')
        if city:
            queryset = queryset.filter(offerlocation__city__iexact=city)
        country = params.get('country')
        if country:
            queryset = queryset.filter(offerlocation__country__iexact=country)

        queryset = queryset.order_by('-id')
        total = queryset.count()

        offset = get_int('offset') or 0
        limit = get_int('limit') or OfferCardPagination.default_limit
        limit = min(limit, OfferCardPagination.max_limit)

        if offset >= total:
            offset = 0

        page_queryset = queryset[offset:offset + limit]
        base = request.build_absolute_uri(request.path)
        def gen_enpoint(offset):
            return f"{base}?limit={limit}&offset={offset}" if 0 <= offset < total else None

        next_offset = offset + limit
        prev_offset = offset - limit

        serializer = OfferCardSerializer(page_queryset, many=True, context={'request': request})
        return Response({
            'count': total,
            'next': gen_enpoint(next_offset),
            'previous': gen_enpoint(prev_offset),
            'results': serializer.data
        })


