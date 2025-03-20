from django.urls import path, include
from reservations.routers import router

urlpatterns = [

    path('', include(router.urls)),
]

