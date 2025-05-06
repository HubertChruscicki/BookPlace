from rest_framework import serializers
from offers.models import Offers
from .models import Reservations, ReservationStatus
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.shortcuts import get_object_or_404


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

class ReservationListFilterSerializer(serializers.Serializer):
    timeframe = serializers.ChoiceField(
        choices=['upcoming', 'past', 'all'],
        default='upcoming',
        help_text="Filter by time frame: 'upcoming', 'past', or 'all'"
    )
    date_from = serializers.DateField(
        required=False,
        help_text="Return reservations with end_date >= date_from"
    )
    date_to = serializers.DateField(
        required=False,
        help_text="Return reservations with start_date <= date_to"
    )
    status = serializers.CharField(
        required=False,
        help_text="Filter by status name"
    )

    def validate(self, data):
        today = timezone.localdate()
        timeframe = data.get('timeframe')
        date_from = data.get('date_from')
        date_to = data.get('date_to')

        if date_from and date_to and date_from >= date_to:
            raise serializers.ValidationError({
                'date_from': "date_from must be before date_to",
                'date_to':   "date_to must after date_from",
            })

        if timeframe == 'past':
            errors = {}
            if date_from and date_from > today:
                errors['date_from'] = "For 'past', date_from cannot be in the future"
            if date_to and date_to > today:
                errors['date_to'] = "For 'past', date_to cannot be in the future"
            if errors:
                raise serializers.ValidationError(errors)

        if timeframe == 'upcoming':
            errors = {}
            if date_from and date_from < today:
                errors['date_from'] = "For 'upcoming', date_from cannot be in the past"
            if date_to and date_to < today:
                errors['date_to'] = "For 'upcoming', date_to cannot be in the past"
            if errors:
                raise serializers.ValidationError(errors)

        return data

class ReservationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservations
        fields = ['start_date', 'end_date', 'guests_number']

    def validate(self, data):
        start = data['start_date']
        end = data['end_date']
        today = timezone.now()

        if start >= end:
            raise serializers.ValidationError("start_date must be before end_date")

        if start < today:
            raise serializers.ValidationError("start_date cannot be in the past")

        offer_pk = self.context['view'].kwargs['offer_pk']
        confirmed  = get_object_or_404(ReservationStatus, name='confirmed')
        overlap_exists = Reservations.objects.filter(
            offer_id=offer_pk,
            status_id=confirmed,
            start_date__lt=end,
            end_date__gt=start
        ).exists()
        if overlap_exists:
            raise serializers.ValidationError("This time slot is already booked")

        return data

    def create(self, validated_data):
        user = self.context['request'].user
        offer = get_object_or_404(Offers, pk=self.context['view'].kwargs['offer_pk'])
        confirmed_status = ReservationStatus.objects.get(name='confirmed')

        return Reservations.objects.create(
            user=user,
            offer_id=offer,
            status_id=confirmed_status,
            **validated_data
        )

class ReservationAvalibilitySerializer(serializers.Serializer):
    """
      Read-only serializer return date range,
    """
    start_date = serializers.DateField()
    end_date = serializers.DateField()