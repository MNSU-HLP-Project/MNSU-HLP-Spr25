from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import SignupSerializer, LoginSerializer

class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                return Response({
                    'message': 'User created successfully'
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    'message': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            extend_user = user.extend_user

            return Response({
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'user': {
                    'email': user.email,
                    'firstName': user.first_name,
                    'lastName': user.last_name,
                    'role': extend_user.role,
                    'organization': extend_user.org
                }
            })
        return Response(
            {'message': 'Invalid email or password'},
            status=status.HTTP_400_BAD_REQUEST
        )
