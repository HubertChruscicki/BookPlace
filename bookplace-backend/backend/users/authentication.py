from datetime import datetime, timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed, ParseError
import jwt

User = get_user_model()

class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        jwt_token = request.META.get('HTTP_AUTHORIZATION')
        print("AUTH HEADER:", jwt_token)

        if jwt_token is None:
            return None

        jwt_token = JWTAuthentication.get_the_token_from_header(jwt_token)

        try:
            payload = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidSignatureError:
            raise AuthenticationFailed('Invalid signature')
        except jwt.DecodeError:
            raise AuthenticationFailed('Invalid token')

        user_id = payload.get('user_id')
        if user_id  is None:
            raise AuthenticationFailed('User ID not found in token')

        user = User.objects.filter(id=user_id).first()
        if user is None:
            raise AuthenticationFailed('User not found')

        request.user = user
        return user, payload

    def authenticate_header(self, request):
        return 'Bearer'

    @classmethod
    def create_jwt(cls, user):
        payload = {
            'user_id': user.id,
            'exp': int((datetime.now() + timedelta(
                hours=getattr(settings, 'JWT_CONFIG', {}).get('TOKEN_LIFETIME_HOURS', 1))).timestamp()),
            'iat': datetime.now().timestamp()
        }

        jwt_token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

        return jwt_token

    @classmethod
    def create_refresh_token(cls, user):
        payload = {
            'user_id': user.id,
            'type': 'refresh',
            'exp': int((datetime.now() + timedelta(
                hours=getattr(settings, 'JWT_CONFIG', {}).get('REFRESH_TOKEN_LIFETIME_HOURS', 16))).timestamp()),
            'iat': datetime.now().timestamp()
        }

        refresh_token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

        return refresh_token

    @classmethod
    def validate_refresh_token(cls, token):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            if payload.get('type') != 'refresh':
                raise AuthenticationFailed('Invalid refresh token type')
            return payload
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Refresh token has expired')
        except jwt.DecodeError:
            raise AuthenticationFailed('Invalid refresh token')

    @classmethod
    def refresh_access_token(cls, refresh_token):
        payload = cls.validate_refresh_token(refresh_token)
        user_id = payload.get('user_id')

        if user_id is None:
            raise AuthenticationFailed('User ID not found in refresh token')

        user = User.objects.filter(id=user_id).first()
        if user is None:
            raise AuthenticationFailed('User not found')

        return cls.create_jwt(user)

    @classmethod
    def get_the_token_from_header(cls, token):
        token = token.replace('Bearer', '').replace(' ', '')
        return token
