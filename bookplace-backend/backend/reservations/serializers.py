from rest_framework import serializers
from offers.models import Offers
from .models import Reservations, ReservationStatus
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.shortcuts import get_object_or_404
from offers.serializers import OfferReservationInfoSerializer
from users.serializers import UserInfoSerializer

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
    offer = OfferReservationInfoSerializer(source='offer_id', read_only=True)
    class Meta:
        model  = Reservations
        fields = [
            'id',
            'start_date',
            'end_date',
            'status',
            'offer',
        ]

class ReservationLandlordSerializer(serializers.ModelSerializer):
    user = UserInfoSerializer(source='landlord_id', read_only=True)
    offer = OfferReservationInfoSerializer(source='offer_id', read_only=True)
    status = serializers.CharField(source='status_id.name', read_only=True)
    class Meta:
        model  = Reservations
        fields = [
            'id',
            'start_date',
            'end_date',
            'total_price',
            'guests_number',
            'status',
            'user',
            'offer',
        ]

class ReservationUserSerializer(serializers.ModelSerializer):
    landlord = UserInfoSerializer(source='offer_id.landlord',read_only=True)
    offer = OfferReservationInfoSerializer(source='offer_id', read_only=True)
    status = serializers.CharField(source='status_id.name', read_only=True)
    class Meta:
        model = Reservations
        fields = [
            'id',
            'start_date',
            'end_date',
            'total_price',
            'guests_number',
            'status',
            'landlord',
            'offer',
        ]

class ReservationLandlordFilterSerializer(serializers.Serializer):

    offer_id = serializers.IntegerField(required=False, help_text="Offer ID")
    status = serializers.ListField(
        child=serializers.CharField(
        help_text="List of reservation status names (e.g. confirmed, cancelled, archive"),
        required=False,
    )
    date_from = serializers.DateField(
        required=False,
        help_text="Return reservations with end_date >= date_from"
    )
    date_to = serializers.DateField(
        required=False,
        help_text="Return reservations with start_date <= date_to"
    )
    def validate_status(self, value):
        valid = set(ReservationStatus.objects.values_list('name', flat=True))
        invalid = [s for s in value if s not in valid]
        if invalid:
            raise serializers.ValidationError(
                f"Invalid status names: {', '.join(invalid)}"
            )
        return value

    def validate(self, data):
        date_from = data.get('date_from')
        date_to = data.get('date_to')

        if date_from and date_to and date_from >= date_to:
            raise serializers.ValidationError({
                'date_from': "date_from must be before date_to",
                'date_to':   "date_to must after date_from",
            })

        return data

#TODO doesnt check the pending status
class ReservationCreateSerializer(serializers.ModelSerializer):
    offer_id = serializers.PrimaryKeyRelatedField(
        queryset=Offers.objects.all(),
        write_only=True,
        help_text="ID of the offer to book"
    )
    class Meta:
        model = Reservations
        fields = ['offer_id', 'start_date', 'end_date', 'guests_number']

    def validate(self, data):
        start = data['start_date']
        end = data['end_date']
        today = timezone.localdate()

        if start >= end:
            raise serializers.ValidationError("start_date must be before end_date")

        if start < today:
            raise serializers.ValidationError("start_date cannot be in the past")

        offer = data['offer_id']

        if data['guests_number'] > offer.max_guests:
            raise serializers.ValidationError("guests_number exceeds offer's max_guests")

        user = self.context['request'].user
        if user == offer.landlord:
            raise serializers.ValidationError("Landlord cannot book their own offer")

        confirmed  = get_object_or_404(ReservationStatus, name='confirmed')
        overlap_exists = Reservations.objects.filter(
            offer_id=offer,
            status_id=confirmed,
            start_date__lt=end,
            end_date__gt=start
        ).exists()
        if overlap_exists:
            raise serializers.ValidationError("This time slot is already booked")

        return data

    def create(self, validated_data):
        user = self.context['request'].user
        offer = validated_data.pop('offer_id')
        confirmed_status = get_object_or_404(ReservationStatus, name='confirmed')

        reservation = Reservations(
            user=user,
            offer_id=offer,
            status_id=confirmed_status,
            **validated_data
        )

        reservation.total_price = reservation.calculate_total_price()
        reservation.save()
        return reservation

