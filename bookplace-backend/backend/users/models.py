from django.db import models

class UserRole(models.Model):
    name = models.CharField(max_length=100, default='')

class Users(models.Model):
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=100, default='')
    first_name = models.CharField(max_length=100, default='')
    last_name = models.CharField(max_length=100, default='')
    phone = models.CharField(max_length=100, default='', unique=True)
    is_active = models.BooleanField(default=True)
    roles = models.ManyToManyField(UserRole, related_name='users')

    def has_role(self, role_name):
        return self.roles.filter(name=role_name).exists()


