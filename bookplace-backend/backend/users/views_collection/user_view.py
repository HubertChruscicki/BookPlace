from rest_framework.viewsets import ModelViewSet
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.viewsets import ViewSet

class UserViewAPI(ViewSet):
    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        mock_data = {
            "id": "1",
            "name": "Hubert Chruscicki",
            "phone": "555 666 777",
            "email": "hubert@gmail.com",
            "city": "Kraków",
            "country": "Polska"
        }
        return Response(mock_data, status=status.HTTP_200_OK)
    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        mock_data = {
            "login": "hubert123",
            "password": "password123"
        }
        return Response(mock_data, status=status.HTTP_200_OK)