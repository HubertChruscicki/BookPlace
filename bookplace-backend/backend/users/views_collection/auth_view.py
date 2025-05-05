from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from users.serializers import RegisterSerializer, UserSerializer, LoginSerializer, LoginResponseSerializer, RegisterResponseSerializer, RefreshTokenRequestSerializer, RefreshTokenResponseSerializer
from users.authentication import JWTAuthentication
from users.models import User
from django.contrib.auth.hashers import check_password
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiTypes

@extend_schema(
    summary="Register user and return access and refresh tokens",
    request=RegisterSerializer,
    responses={201: RegisterResponseSerializer},
    description="Register a new user and return access and refresh tokens."
)
class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            access_token = JWTAuthentication.create_jwt(user)
            refresh_token = JWTAuthentication.create_refresh_token(user)
            return Response({
                "access": access_token,
                "refresh": refresh_token,
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]
    @extend_schema(
        summary="Login user and return access and refresh tokens",
        request=LoginSerializer,
        responses={200: LoginResponseSerializer},
        description="Log in user and return access and refresh tokens."
    )
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"error": "Missing credentials"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email).first()
        if not user or not check_password(password, user.password):
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        access_token = JWTAuthentication.create_jwt(user)
        refresh_token = JWTAuthentication.create_refresh_token(user)
        return Response({
            "access": access_token,
            "refresh": refresh_token,
            "user": UserSerializer(user).data
        }, status=status.HTTP_200_OK)

@extend_schema(
    summary="Refresh access token using refresh token",
    request=RefreshTokenRequestSerializer,
    responses={200: RefreshTokenResponseSerializer},
    description="Use refresh token to get a new access token."
)
class RefreshTokenView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        refresh_token = request.data.get('refresh')

        if not refresh_token:
            return Response({"error": "Missing refresh token"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            new_access_token = JWTAuthentication.refresh_access_token(refresh_token)
            return Response({
                "token": new_access_token
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)


