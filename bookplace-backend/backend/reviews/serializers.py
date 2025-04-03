from rest_framework import serializers

from .models import Reviews
class ReviewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reviews
        fields = [
            'id',
            'user_id',
            'offer_id',
            'rating',
            'comment',
            'created_at'
        ]
    def validate_user_id(self, value):
        if not value:
            raise serializers.ValidationError("User ID is required.")
        return value

    def validate_offer_id(self, value):
        if not value:
            raise serializers.ValidationError("Offer ID is required.")
        return value
    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def validate_comment(self, value):
        if not value:
            raise serializers.ValidationError("Comment is required.")
        return value





