from django.db import models
from offers.models import Offers
from django.conf import settings
class Reviews(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    offer_id = models.ForeignKey(Offers, on_delete=models.CASCADE)
    rating = models.IntegerField(default=0)
    comment = models.CharField(max_length=1000, default='')
    created_at = models.DateTimeField(auto_now_add=True)

