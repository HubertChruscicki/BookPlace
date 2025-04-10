from django.db import models
from users.models import Users
from django.core.validators import MinValueValidator, MaxValueValidator


class Offers(models.Model):
    landlord_id = models.ForeignKey(Users, on_delete=models.CASCADE)
    offer_types = models.ManyToManyField('OfferTypes')
    offer_main_type = models.ForeignKey('OfferTypes', on_delete=models.CASCADE, related_name='main_offer_type', default=1)
    title = models.CharField(max_length=100, default='')
    description = models.CharField(max_length=1000, default='')
    price_per_night = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)]
    )
    max_guests = models.IntegerField(default=1)
    is_active = models.BooleanField(default=True)


class OfferTypes(models.Model):
    name = models.CharField(max_length=100, default='')
    #TODO MAIN TYPE TO DISPLAY ON OFFER PAGE

class OfferLocation(models.Model):
    offer_id = models.OneToOneField(Offers, on_delete=models.CASCADE)
    country = models.CharField(max_length=100, default='')
    city = models.CharField(max_length=100, default='')
    address = models.CharField(max_length=100, default='')
    province = models.CharField(max_length=100, default='')
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, default=0,
        validators=[MinValueValidator(-90.0), MaxValueValidator(90.0)]
    )

    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, default=0,
        validators=[MinValueValidator(-180.0), MaxValueValidator(180.0)]
    )


class OfferImages(models.Model):
    offer_id = models.ForeignKey(Offers, on_delete=models.CASCADE)
    is_main = models.BooleanField(default=False)
    path = models.FileField(upload_to='images/')


class OfferDetails(models.Model):
    offer_id = models.OneToOneField(Offers, on_delete=models.CASCADE, primary_key=True)
    private_bathroom = models.BooleanField(default=False)
    kitchen = models.BooleanField(default=False)
    wifi = models.BooleanField(default=False)
    tv = models.BooleanField(default=False)
    fridge_in_room = models.BooleanField(default=False)
    air_conditioning = models.BooleanField(default=False)
    smoking_allowed = models.BooleanField(default=False)
    pets_allowed = models.BooleanField(default=False)
    parking = models.BooleanField(default=False)
    swimming_pool = models.BooleanField(default=False)
    sauna = models.BooleanField(default=False)
    jacuzzi = models.BooleanField(default=False)
    rooms = models.IntegerField(default=1)
    beds = models.IntegerField(default=0)
    double_beds = models.IntegerField(default=0)
    sofa_beds = models.IntegerField(default=0)
