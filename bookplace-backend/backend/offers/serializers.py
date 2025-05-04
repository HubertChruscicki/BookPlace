from rest_framework import serializers
from .models import Offers, OfferLocation, OfferDetails, OfferImages, OfferTypes, OfferAmenities
from users.models import Users
from datetime import datetime
from django.core.files.base import ContentFile
import base64
import json


class OfferDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferDetails
        fields = [
            'rooms',
            'beds',
            'double_beds',
            'sofa_beds',
        ]

class OfferAmenitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferAmenities
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
        ]

class AmenityFieldsSerializer(serializers.Serializer):
    key = serializers.CharField()
    label = serializers.CharField()

class OfferLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferLocation
        fields = [
            'country',
            'city',
            'address',
            'province',
            'latitude',
            'longitude'
        ]

class OfferGetImagesSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = OfferImages
        fields = [
            'is_main',
            'image'
        ]
    def get_image(self, obj):
        request = self.context.get('request')
        if request is not None:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url

class OfferTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferTypes
        fields = [
            'id',
            'name'
        ]

class LandlordBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = [
            'id',
            'first_name'
        ]

class OffersSerializer(serializers.ModelSerializer):
    location = OfferLocationSerializer(source='offerlocation', read_only=True)
    offer_type = OfferTypesSerializer(read_only=True)
    details = OfferDetailsSerializer(source='offerdetails', read_only=True)
    amenities = OfferAmenitiesSerializer(source='offeramenities', read_only=True)
    images = OfferGetImagesSerializer(source='offerimages_set', many=True, read_only=True)
    landlord = LandlordBasicSerializer(read_only=True)
    class Meta:
        model = Offers
        fields = [
            'id',
            'landlord',
            'offer_type',
            'title',
            'description',
            'price_per_night',
            'max_guests',
            'is_active',
            'location',
            'details',
            'amenities',
            'images'
        ]

class OfferUploadImageBase64Serializer(serializers.ModelSerializer):
    image = serializers.CharField(write_only=True)
    class Meta:
        model = OfferImages
        fields = ['is_main', 'image']
        extra_kwargs = {
            'offer': {'write_only': True}
        }
    def create(self, validated_data):
        image_base64 = validated_data.pop('image')
        offer = self.context.get('offer')
        format, imgstr = image_base64.split(';base64,')
        ext = format.split('/')[-1]
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        filename = f"offer{offer.id}img{timestamp}.{ext}"

        image_file = ContentFile(base64.b64decode(imgstr), name=filename)
        offer_image = OfferImages.objects.create(
            offer_id=offer,
            is_main=validated_data['is_main'],
        )
        offer_image.image.save(filename, image_file, save=True)
        return offer_image


class CreateOfferSerializer(serializers.ModelSerializer):
    location = OfferLocationSerializer(write_only=True)
    details = OfferDetailsSerializer(write_only=True)
    amenities = OfferAmenitiesSerializer(write_only=True)
    images = OfferUploadImageBase64Serializer(many=True, write_only=True)
    class Meta:
        model = Offers
        fields = [
            'offer_type',
            'title',
            'description',
            'price_per_night',
            'max_guests',
            'location',
            'details',
            'amenities',
            'images'
        ]
        extra_kwargs = {
            'offer_type': {'required': True},
            'title': {'required': True},
            'description': {'required': True},
            'price_per_night': {'required': True},
            'max_guests': {'required': True},
        }
    def create(self, validated_data):
        location_data = validated_data.pop('location')
        details_data = validated_data.pop('details')
        amenities_data = validated_data.pop('amenities')
        images_data = validated_data.pop('images')

        #TODO change for logged landlord for now HARDOCODED
        landlord = Users.objects.get(id=2)

        offer = Offers.objects.create(
            landlord=landlord,
            is_active=True,
            **validated_data
        )
        OfferLocation.objects.create(offer_id=offer, **location_data)
        OfferDetails.objects.create(offer_id=offer, **details_data)
        OfferAmenities.objects.create(offer_id=offer, **amenities_data)

        for image in images_data:
            image_serializer = OfferUploadImageBase64Serializer(
                data=image,
                context={'offer': offer}
            )
            image_serializer.is_valid(raise_exception=True)
            image_serializer.save()

        return offer

    # serializers.py
    from rest_framework import serializers
    from .models import Offers

class OfferCardSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source='offer_type.name')
    city = serializers.CharField(source='offerlocation.city')
    country = serializers.CharField(source='offerlocation.country')
    img_url = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()

    class Meta:
        model = Offers
        fields = [
            'id',
            'title',
            'type',
            'price_per_night',
            'rating',
            'city',
            'country',
            'img_url',
        ]

    def get_img_url(self, obj):
        img = obj.offerimages_set.filter(is_main=True).first()
        url = img.image.url if img else ''
        request = self.context.get('request')
        return request.build_absolute_uri(url) if request else url

    def get_rating(self, obj):
        return 4.6  #TODO hardcoded