from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiResponse
from offers.models import OfferAmenities
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin

from ..serializers import AmenityFieldsSerializer
class OfferAmenitiesViewAPI(ListModelMixin, GenericViewSet):
    serializer_class  = AmenityFieldsSerializer
    #permision_classes TODO
    def get_queryset(self):
        return OfferAmenities.objects.none()

    @extend_schema(
        summary="List all amenities key values",
        description="Retrieve a list of amenities with their key values.",
        responses={200: OpenApiResponse(response=AmenityFieldsSerializer(many=True))}
    )
    def list(self, request, *args, **kwargs):
        fields = OfferAmenities._meta.get_fields()
        fields_names = [
            f.name for f in fields
            if f.name != 'offer_id' and f.concrete
        ]

        data = [
            {
                "key": name,
                "name": name.replace('_', ' ').capitalize(),
            }
            for name in fields_names
        ]

        return Response(data)





