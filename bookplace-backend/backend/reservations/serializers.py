from rest_framework import serializers
from offers.models import Offers
from .models import Reservations, ReservationStatus
from django.contrib.auth import get_user_model

User = get_user_model()
class ReservationSerializer(serializers.ModelSerializer):

    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    offer = serializers.PrimaryKeyRelatedField(source='offer_id', queryset=Offers.objects.all())
    status = serializers.PrimaryKeyRelatedField(source='status_id', queryset=ReservationStatus.objects.all())
    class Meta:
        model  = Reservations
        fields = [
            'id',
            'user',
            'offer',
            'start_date',
            'end_date',
            'guests_number',
            'total_price',
            'status',
        ]

class ReservationInfoSerializer(serializers.ModelSerializer):

    status = serializers.CharField(source='status_id.name', read_only=True)
    class Meta:
        model  = Reservations
        fields = [
            'id',
            'start_date',
            'end_date',
            'status',
        ]
    class ReservationAvalibilitySerializer(serializers.Serializer):
        """
          Read-only serializer return date range,
        """
        start_date = serializers.DateField()
        end_date = serializers.DateField()