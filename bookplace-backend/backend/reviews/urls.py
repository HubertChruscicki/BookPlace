from django.urls import path, include
from reviews.routers import router

urlpatterns = [
    path('', include(router.urls)),
]

