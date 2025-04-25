from rest_framework import serializers
from users.models import Users, UserRole
import re
class UserSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()
    class Meta:
        model = Users
        fields = ['id', 'email', 'first_name', 'last_name', 'phone', 'roles']

    def get_roles(self, obj):
        return list(obj.roles.values_list('name', flat=True))

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['email', 'password', 'first_name', 'last_name', 'phone']
    def create(self, validated_data):
        from django.contrib.auth.hashers import make_password
        validated_data['password'] = make_password(validated_data['password'])
        user = super().create(validated_data)
        default_role, created = UserRole.objects.get_or_create(name="user")
        user.roles.add(default_role)
        return user
    def validate_email(self, value):
        if Users.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value
    def validate_phone(self, value):
        pattern = r'^\+?\d{9,15}$'
        if not re.match(pattern, value):
            raise serializers.ValidationError(
                "Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
            )
        if Users.objects.filter(phone=value).exists():
            raise serializers.ValidationError("Phone number already exists")

        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter")
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter")
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("Password must contain at least one digit")
        if not re.search(r'[@$!%*?&]', value):
            raise serializers.ValidationError("Password must contain at least one special character")
        return value
class RegisterResponseSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = UserSerializer()
class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['email', 'password']
class LoginResponseSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = UserSerializer()

class RefreshTokenRequestSerializer(serializers.Serializer):
    refresh = serializers.CharField()
class RefreshTokenResponseSerializer(serializers.Serializer):
    token = serializers.CharField()



