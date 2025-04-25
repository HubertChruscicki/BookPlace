from django.urls import path, include
from .views_collection.auth_view import RegisterView, LoginView, RefreshTokenView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('refresh/', RefreshTokenView.as_view()),
]
