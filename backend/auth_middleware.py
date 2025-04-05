
from django.http import JsonResponse
from django.contrib.auth.models import AnonymousUser
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth import get_user_model
import jwt
from django.conf import settings

User = get_user_model()

class TokenAuthMiddleware(MiddlewareMixin):
    def process_request(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            try:
                jwt.decode(token, settings.SECRET_KEY, algorithms=settings.JWT_ALGORITHM)
                
            except (jwt.ExpiredSignatureError):
                return JsonResponse({'message': 'Session Expired, Please Log In'}, status=401)
            except (jwt.DecodeError, User.DoesNotExist):
                return JsonResponse({'message': 'Invalid token'}, status=401)
        else:
            request.user = AnonymousUser()
