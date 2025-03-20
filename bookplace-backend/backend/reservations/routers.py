from rest_framework.routers import DefaultRouter

from .views_collection.reservation_view import ReservationViewAPI

router = DefaultRouter()

router.register(r'reservations', ReservationViewAPI, basename='reservations')