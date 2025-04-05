from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
import jwt
from django.conf import settings
from django.contrib.auth.models import User

class CustomJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        try:
            prefix, token = auth_header.split(' ')
            if prefix.lower() != 'bearer':
                return None
        except:
            return None

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
            user = User.objects.get(username=payload['id'])
        except (jwt.DecodeError, jwt.ExpiredSignatureError, User.DoesNotExist):
            raise exceptions.AuthenticationFailed('Invalid token')

        return (user, None)
