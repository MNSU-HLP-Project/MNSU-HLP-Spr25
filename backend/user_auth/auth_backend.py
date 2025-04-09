from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
import jwt
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.permissions import BasePermission

class CustomJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        path = request.path.lower()
        
        # Allow unauthenticated access to login and signup
        if path.endswith('/login/') or path.endswith('/signup/') or path.endswith('/getgrades/'):
            return None
        # Get the token from auth_header
        prefix, token = auth_header.split(' ')


        try:
            # Decode and get user
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
            user = User.objects.get(username=payload['id'])
            user.role = payload.get('role')
        except (jwt.ExpiredSignatureError):
            raise exceptions.AuthenticationFailed('Token Expired')
        except (jwt.DecodeError, User.DoesNotExist):
            raise exceptions.AuthenticationFailed('Invalid token')
        # DRF expects a tuple or user and any other auth info
        return (user, None)

# Permission classes for DRF 
class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'role') and request.user.role == 'Admin'

class IsSupervisor(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'role') and request.user.role == 'Supervisor'

class IsStudentTeacher(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'role') and request.user.role == 'Student Teacher'
    
class IsSuperuser(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'role') and request.user.role == 'Superuser'

class IsSupervisorOrAdminOrSuperuser(BasePermission):
    def has_permission(self, request, view):
        return (IsSupervisor().has_permission(request, view) or
                IsAdmin().has_permission(request, view) or
                IsSuperuser().has_permission(request, view))

