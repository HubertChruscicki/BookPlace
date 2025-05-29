import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from users.models import User
from users.authentication import JWTAuthentication
import json

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def test_password():
    return "Test123@#"

@pytest.fixture
def test_user(db, test_password):
    user = User.objects.create_user(
        email="test@example.com",
        password=test_password,
        first_name="Test",
        last_name="User",
        phone="123456789"
    )
    return user


@pytest.fixture
def test_user_tokens(test_user):
    access_token = JWTAuthentication.create_jwt(test_user)
    refresh_token = JWTAuthentication.create_refresh_token(test_user)
    return {"access": access_token, "refresh": refresh_token}


@pytest.fixture
def valid_register_data():
    return {
        "email": "newuser@example.com",
        "password": "NewUser123@#",
        "first_name": "New",
        "last_name": "User",
        "phone": "987654321"
    }


class TestRegisterView:
    def test_register_success(self, api_client, valid_register_data):
        """Testing successful user registration - should return status 201"""
        url = reverse('register')
        response = api_client.post(url, valid_register_data, format='json')

        assert response.status_code == status.HTTP_201_CREATED
        assert 'access' in response.data
        assert 'refresh' in response.data
        assert 'user' in response.data
        assert User.objects.filter(email=valid_register_data['email']).exists()

    def test_register_invalid_data(self, api_client):
        """Testing registration with invalid data - should return status 400"""
        url = reverse('register')
        invalid_data = {
            "email": "invalid-email",
            "password": "short",
            "first_name": "",
            "last_name": "",
            "phone": "123"
        }
        response = api_client.post(url, invalid_data, format='json')

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_register_duplicate_email(self, api_client, test_user, valid_register_data):
        """Testing registration with an existing email - should return status 400"""
        url = reverse('register')
        duplicate_data = valid_register_data.copy()
        duplicate_data['email'] = test_user.email

        response = api_client.post(url, duplicate_data, format='json')

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "user with this email already exists" in str(response.data)


class TestLoginView:
    def test_login_success(self, api_client, test_user, test_password):
        """Testing successful login - should return status 200"""
        url = reverse('login')
        data = {
            'email': test_user.email,
            'password': test_password
        }
        response = api_client.post(url, data, format='json')

        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
        assert 'user' in response.data

    def test_login_invalid_credentials(self, api_client, test_user):
        """Testing login with invalid credentials - should return status 401"""
        url = reverse('login')
        data = {
            'email': test_user.email,
            'password': 'wrong_password'
        }
        response = api_client.post(url, data, format='json')

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_missing_credentials(self, api_client):
        """Testing login without required fields - should return status 400"""
        url = reverse('login')
        data = {}
        response = api_client.post(url, data, format='json')

        assert response.status_code == status.HTTP_400_BAD_REQUEST


class TestRefreshTokenView:

    def test_refresh_token_success(self, api_client, test_user_tokens):
        """Testing successful token refresh - should return status 200"""
        url = reverse('refresh')
        data = {
            'refresh': test_user_tokens['refresh']
        }
        response = api_client.post(url, data, format='json')

        assert response.status_code == status.HTTP_200_OK
        assert 'token' in response.data

    def test_refresh_token_invalid(self, api_client):
        """Testing token refresh with an invalid token - should return status 401"""
        url = reverse('refresh')
        data = {
            'refresh': 'invalid_token'
        }
        response = api_client.post(url, data, format='json')

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_refresh_token_missing(self, api_client):
        """Testing token refresh without providing a token - should return status 400"""
        url = reverse('refresh')
        data = {}
        response = api_client.post(url, data, format='json')

        assert response.status_code == status.HTTP_400_BAD_REQUEST