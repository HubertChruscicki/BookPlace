from django.urls import path, include
from users.routers import router

urlpatterns = [
    path('', include(router.urls)),
]

