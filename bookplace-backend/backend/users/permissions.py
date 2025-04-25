from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.roles.filter(name='admin').exists()

class IsLandlord(BasePermission):
    def has_permission(self, request, view):
        return request.user.roles.filter(name='landlord').exists()

class IsUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.roles.filter(name='user').exists()
