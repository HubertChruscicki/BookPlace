from datetime import datetime, timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed, ParseError
import jwt
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        logger.debug("RAW AUTH HEADER: %r", auth_header)

        if auth_header is None:
            return None

        token = JWTAuthentication.get_the_token_from_header(auth_header)
        logger.debug("STRIPPED TOKEN: %s", token)

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            logger.debug("DECODED PAYLOAD: %r", payload)
        except jwt.ExpiredSignatureError:
            logger.debug("Token expired")
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidSignatureError:
            logger.debug("Invalid signature")
            raise AuthenticationFailed('Invalid signature')
        except jwt.DecodeError:
            logger.debug("Malformed token")
            raise AuthenticationFailed('Invalid token')

        user_id = payload.get('user_id')
        logger.debug("Looking up User with id = %s", user_id)
        if user_id is None:
            logger.debug("No user_id in payload")
            raise AuthenticationFailed('User ID not found in token')

        user = User.objects.filter(id=user_id).first()
        if not user:
            logger.debug("No User found for id = %s", user_id)
            raise AuthenticationFailed('User not found')

        logger.debug("Authenticated user: %s", user)
        return (user, token)


    def authenticate_header(self, request):
        return 'Bearer'

    @classmethod
    def create_jwt(cls, user):
        payload = {
            'user_id': user.id,
            'role': user.role,
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
