from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from offers.models import Offers
from ..models import Reviews
from ..serializers import ReviewsSerializer

class ReviewViewAPI(ModelViewSet):
    queryset = Reviews.objects.all()
    serializer_class = ReviewsSerializer
    permission_classes = [IsAuthenticated]
    @action(
        detail=False,
        methods=["post"],
        url_path=r"add-review/(?P<offer_id>[^/.]+)"
    )
    def add_review(self, request, offer_id=None):
        offer = get_object_or_404(Offers, pk=offer_id)

        data = {
            "offer_id": offer.id,
            "rating":   request.data.get("rating"),
            "comment":  request.data.get("comment"),
        }

        serializer = self.get_serializer(data=data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        review = serializer.save()
        return Response(
            ReviewsSerializer(review).data,
            status=status.HTTP_201_CREATED
        )
