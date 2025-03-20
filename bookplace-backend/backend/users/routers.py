from rest_framework.routers import DefaultRouter

from .views_collection.user_view import UserViewAPI

router = DefaultRouter()

router.register(r'users', UserViewAPI, basename='users')