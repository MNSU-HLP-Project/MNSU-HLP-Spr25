from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login
from .serializers import SignupSerializer, LoginSerializer, InvitationSerializer
import jwt
from django.conf import settings
from .models import ExtendUser, Invitation
from .models import ExtendUser, Invitation, Organization, StudentTeacher, Supervisor, GradeLevel
from .serializers import ExtendUserSerializer, GradeLevelSerializer, OrganizationSerializer, StudentTeacherSerializer, SupervisorSerializer
from rest_framework.decorators import api_view
from django.contrib.auth.models import User

def check_token(token):
    """Checks Token and returns a token dictionary

    Args:
        token (_type_): A JWT token
    """
    decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=settings.JWT_ALGORITHM)
    if decoded:
        return decoded
    else:
        return None
    
@api_view(['GET'])
def get_grade_levels(request):
    grade_levels = GradeLevel.objects.all()
    serializer = GradeLevelSerializer(grade_levels, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def generate_invitation(request):
    max_uses = 50
    token = check_token(request.data['token'])
    
    if not token:
        return Response({'error': 'User not authenticated'}, status=400)
    
    role = token['role']
    userid = token['id']
    if not userid:
        return Response({'error': 'User ID is required'}, status=400)

    # Ensure user exists before creating invitation
    try:
        teacher = User.objects.get(username=userid)
    except User.DoesNotExist:
        return Response({'error': 'Teacher not found'}, status=status.HTTP_404_NOT_FOUND)
    
    org = ExtendUser.objects.get(user=teacher).org

    # Check if user is authorized
    if ExtendUser.objects.filter(user=teacher, role__in=['Supervisor', 'Admin']).exists() is False:
        return Response({'error': 'Not Authorized'}, status=status.HTTP_401_UNAUTHORIZED)

    # Check if invitation already exists
    invitation = Invitation.objects.filter(teacher=teacher).first()
    if invitation and invitation.use_count < invitation.max_uses:
        return Response(InvitationSerializer(invitation).data)
    elif invitation and invitation.use_count >= invitation.max_uses:
        invitation.delete()
    
    if role == 'Supervisor':
        newrole = 'Student Teacher'
    else: 
        newrole = 'Supervisor'
        
    invitation = Invitation.objects.create(teacher=teacher, role=newrole, max_uses=max_uses, org=org)
    return Response({'invitation': InvitationSerializer(invitation).data,
                     'role': newrole})

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
            token = jwt.encode({
                'role': ExtendUser.objects.get(user=user).role, 
                'id': user.username, 
                'firstname': user.first_name, 
                'lastname': user.last_name,
                'org': ExtendUser.objects.get(user=user).org.name
                }, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
            return Response({"token": token, "role": ExtendUser.objects.get(user=user).role}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
