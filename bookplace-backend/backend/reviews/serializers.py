from rest_framework import serializers
from users.models import User
from offers.models import Offers
from .models import Reviews

class ReviewsSerializer(serializers.ModelSerializer):

    user = serializers.PrimaryKeyRelatedField(
        read_only=True
    )
    offer_id = serializers.PrimaryKeyRelatedField(
        queryset=Offers.objects.all()
    )
    class Meta:
        model = Reviews
        fields = ['id', 'user', 'offer_id', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'created_at', 'user']

    def create(self, validated_data):
        user = self.context['request'].user
        return Reviews.objects.create(user=user, **validated_data)
