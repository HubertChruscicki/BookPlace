from django.db import models
from users.models import Users
from offers.models import Offers

class Reviews(models.Model):
    user_id = models.ForeignKey(Users, on_delete=models.CASCADE)
    offer_id = models.ForeignKey(Offers, on_delete=models.CASCADE)
    rating = models.IntegerField(default=0)
    comment = models.CharField(max_length=1000, default='')
    created_at = models.DateTimeField(auto_now_add=True)

