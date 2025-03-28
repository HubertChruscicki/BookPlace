from ..models import OfferTypes
from ..serializers import OfferTypesSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import NotFound
from django.http import Http404


class OfferTypeViewAPI(ModelViewSet):
    serializer_class = OfferTypesSerializer
    def get_queryset(self):
        return OfferTypes.objects.all()

    def get_object(self):
        try:
            return super().get_object()
        except Http404:
            raise NotFound(detail="Such offer type.")



