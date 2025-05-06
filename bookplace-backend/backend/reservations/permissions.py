from django.db.models import Q
from rest_framework.permissions import BasePermission
from users.models import User

class CanAccessReservation(BasePermission):
    """
    - Admins see everything.
    - Landlords see reservations they made + reservations on their offers.
    - Users see only reservations they made.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        user = request.user

        if user.role == User.ROLE_ADMIN:
            return True

        if user.role == User.ROLE_LANDLORD:
            if obj.user_id == user.id:
                return True
            if getattr(obj.offer_id, 'owner_id', None) == user.id:
                return True

        if user.role == User.ROLE_USER and obj.user_id == user.id:
            return True

        return False
