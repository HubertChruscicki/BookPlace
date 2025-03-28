from ..models import OfferImages
from ..serializers import OfferImagesSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import NotFound
from django.http import Http404
from rest_framework.response import Response
from rest_framework import status

class OfferImagesViewAPI(ModelViewSet):
    serializer_class = OfferImagesSerializer
    def get_queryset(self):
        return OfferImages.objects.all()

    def list(self, request, *args, **kwargs):
        return Response({"detail": "Method Not Allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    def get_object(self):
        try:
            return super().get_object()
        except Http404:
            raise NotFound(detail="Offer deosnt exist or doesnt have provided details.")

