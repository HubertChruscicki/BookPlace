from rest_framework.routers import DefaultRouter

from .views_collection.reviews_view import ReviewViewAPI

router = DefaultRouter()

router.register(r'reviews', ReviewViewAPI, basename='reviews')