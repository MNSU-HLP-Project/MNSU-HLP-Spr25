from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login
from .serializers import SignupSerializer, LoginSerializer, InvitationSerializer
import jwt
from django.conf import settings
from .models import ExtendUser, Invitation
from rest_framework.decorators import api_view

@api_view(['POST'])
def generate_invitation(request):
    max_uses = request.data.get('max_uses', None) 
    userid = request.data.get('userid')
    if not userid:
        return Response({'error': 'User ID is required'}, status=400)

    # Ensure user exists before creating invitation
    from django.contrib.auth.models import User
    try:
        teacher = User.objects.get(username=userid)
    except User.DoesNotExist:
        return Response({'error': 'Teacher not found'}, status=404)

    invitation = Invitation.objects.create(teacher=teacher, max_uses=max_uses)
    return Response(InvitationSerializer(invitation).data)

class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Account created successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            #TODO add a role to this
            token = jwt.encode({
                'role': ExtendUser.objects.get(user=user).role, 
                'id': user.username, 
                'firstname': user.first_name, 
                'lastname': user.last_name,
                'org': ExtendUser.objects.get(user=user).org
                }, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
            login(request, user)
            return Response({"token": token}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
