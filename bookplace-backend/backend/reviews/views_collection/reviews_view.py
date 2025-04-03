from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from django.http import Http404
from rest_framework.viewsets import ModelViewSet

from ..models import Reviews
from ..serializers import ReviewsSerializer
from users.models import Users
from offers.models import Offers

class ReviewViewAPI(ModelViewSet):
    serializer_class = ReviewsSerializer
    def get_queryset(self):
        return Reviews.objects.all()

    def get_object(self):
        try:
            return super().get_object()
        except Http404:
            raise NotFound(detail="Review does not exist or does not have provided details.")

    @action(detail=False, methods=["post"], url_path="add-review/(?P<offer_id>[^/.]+)")
    def add_review(self, request,  offer_id=None):
        try:
            offer = Offers.objects.get(pk=offer_id)
        except Offers.DoesNotExist:
            raise NotFound(detail="Offer does not exist.")

        try:
            user = Users.objects.get(pk=2)
        except Users.DoesNotExist:
            raise NotFound(detail="User does not exist.")

        data={
            "user_id": user.id,
            "offer_id": offer.id,
            "rating": request.data.get("rating"),
            "comment": request.data.get("comment"),
        }

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save(user_id=user, offer_id=offer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)