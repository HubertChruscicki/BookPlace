from rest_framework.routers import DefaultRouter

from .views_collection.offer_view import OfferViewAPI

router = DefaultRouter()

router.register(r'offers', OfferViewAPI, basename='offers')