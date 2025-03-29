from rest_framework import serializers
from .models import Offers, OfferLocation, OfferDetails, OfferImages, OfferTypes
from users.models import Users
class OffersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offers
        fields = [
            'id',
            'landlord_id',
            'offer_types',
            'title',
            'description',
            'price_per_night',
            'max_guests',
            'is_active'
        ]
        depth = 1
    def validate_price_per_night(self, value):
        if value < 0:
            raise serializers.ValidationError("Price per night cannot be negative.")
        return value

    def validate_max_guests(self, value):
        if value < 1:
            raise serializers.ValidationError("Max guests must be at least 1.")
        return value

    def validate(self, attrs):
        if not attrs.get('offer_types'):
            raise serializers.ValidationError("At least one offer type is required.")
        return attrs

    def create(self, validated_data):
        offer_types = validated_data.pop('offer_types')
        offer = Offers.objects.create(**validated_data)
        offer.offer_types.set(offer_types)
        return offer

    def update(self, instance, validated_data):
        offer_types = validated_data.pop('offer_types', [])
        instance = super().update(instance, validated_data)
        instance.offer_types.set(offer_types)
        return instance

class OfferDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferDetails
        fields = [
            'private_bathroom',
            'kitchen',
            'wifi',
            'tv',
            'fridge_in_room',
            'air_conditioning',
            'smoking_allowed',
            'pets_allowed',
            'parking',
            'swimming_pool',
            'sauna',
            'jacuzzi',
            'rooms',
            'beds',
            'double_beds',
            'sofa_beds'
        ]

    def validate_rooms(self, value):
        if value < 1:
            raise serializers.ValidationError("Rooms must be at least 1.")
        return value

    def validate_beds(self, value):
        if value < 0:
            raise serializers.ValidationError("Beds cannot be negative.")
        return value

    def validate_double_beds(self, value):
        if value < 0:
            raise serializers.ValidationError("Double beds cannot be negative.")
        return value

    def validate_sofa_beds(self, value):
        if value < 0:
            raise serializers.ValidationError("Sofa beds cannot be negative.")
        return value

class OfferLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferLocation
        fields = [
            'country',
            'city',
            'address',
            'latitude',
            'longitude'
        ]
    def validate_country(self, value):
        if not value:
            raise serializers.ValidationError("Country is required.")
        return value

    def validate_city(self, value):
        if not value:
            raise serializers.ValidationError("City is required.")
        return value

    def validate_address(self, value):
        if not value:
            raise serializers.ValidationError("Address is required.")
        return value
    def validate_latitude(self, value):
        if value < -90 or value > 90:
            raise serializers.ValidationError("Latitude must be between -90 and 90.")
        return value

    def validate_longitude(self, value):
        if value < -180 or value > 180:
            raise serializers.ValidationError("Longitude must be between -180 and 180.")
        return value

class OfferImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferImages
        fields = [
            'id',
            'is_main',
            'path'
        ]

    def validate_is_main(self, value):
        if value is None:
            raise serializers.ValidationError("is_main is required.")
        return value

    def validate_path(self, value):
        if not value:
            raise serializers.ValidationError("path is required.")
        return value

class OfferTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferTypes
        fields = [
            'id',
            'name'
        ]
    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Name is required.")
        return value


class LandlordBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = [
            'id',
            'first_name'
        ]





