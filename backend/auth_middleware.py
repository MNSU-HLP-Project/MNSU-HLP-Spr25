
from django.http import JsonResponse
from django.contrib.auth.models import AnonymousUser
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth import get_user_model
import jwt
from django.conf import settings

User = get_user_model()

# Middleware to check token
class TokenAuthMiddleware(MiddlewareMixin):
    def process_request(self, request):
        #Get header data from request
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        # Should start with bearer
        if auth_header.startswith('Bearer '):
            #Get token from splitting the string
            token = auth_header.split(' ')[1]
            try:
                #Decode with secret key and algo
                jwt.decode(token, settings.SECRET_KEY, algorithms=settings.JWT_ALGORITHM)
            # If expiered raise 401
            except (jwt.ExpiredSignatureError):
                return JsonResponse({'message': 'Session Expired, Please Log In'}, status=401)
            # If can't decode or doesn't exist raise 401
            except (jwt.DecodeError, User.DoesNotExist):
                return JsonResponse({'message': 'Invalid token'}, status=401)
        else:
            # If signin or login should not have bearer and should be passed through
            request.user = AnonymousUser()
