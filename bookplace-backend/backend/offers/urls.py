from django.urls import path, include
from offers.routers import router

urlpatterns = [
    path('', include(router.urls)),
]