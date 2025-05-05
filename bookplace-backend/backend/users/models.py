from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, role="user", **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, role=User.ROLE_ADMIN, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    class Meta:
        db_table = 'users_users'

    ROLE_ADMIN = "admin"
    ROLE_LANDLORD = "landlord"
    ROLE_USER = "user"
    ROLE_CHOICES = [
        (ROLE_ADMIN, "Admin"),
        (ROLE_LANDLORD, "Landlord"),
        (ROLE_USER, "User"),
    ]
    id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=100, unique=True)
    phone = models.CharField(max_length=100, default='', unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=ROLE_USER,)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects    = UserManager()

    USERNAME_FIELD  = "email"
    REQUIRED_FIELDS = [email, first_name, last_name, role]
    def __str__(self):
        return f"{self.email} ({self.get_role_display()})"