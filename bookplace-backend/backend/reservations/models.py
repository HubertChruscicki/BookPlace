from django.db import models
from offers.models import Offers
from django.core.validators import MinValueValidator
from django.conf import settings

class Reservations(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reservations'
    )
    offer_id = models.ForeignKey(Offers, on_delete=models.CASCADE)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    total_price = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)]
    )
    guests_number = models.IntegerField(default=1)
    status_id = models.ForeignKey('ReservationStatus', on_delete=models.CASCADE)

class ReservationStatus(models.Model):
    name = models.CharField(max_length=100, default='')