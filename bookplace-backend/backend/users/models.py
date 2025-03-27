from django.db import models

class Users(models.Model):
    email = models.CharField(max_length=100, default='', unique=True)
    password = models.CharField(max_length=100, default='')
    first_name = models.CharField(max_length=100, default='')
    last_name = models.CharField(max_length=100, default='')
    phone = models.CharField(max_length=100, default='', unique=True)
    is_active = models.BooleanField(default=True)

class UserPermissions(models.Model):
    user_id = models.ForeignKey(Users, on_delete=models.CASCADE)
    role_id = models.ForeignKey('UserRole', on_delete=models.CASCADE)

class UserRole(models.Model):
    name = models.CharField(max_length=100, default='')



