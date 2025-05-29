from django.urls import path, include
from .views_collection.auth_view import RegisterView, LoginView, RefreshTokenView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', RefreshTokenView.as_view(), name='refresh'),
]
