from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login
from .serializers import SignupSerializer, LoginSerializer, InvitationSerializer
import jwt
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.conf import settings
from .models import ExtendUser, Invitation, Organization, StudentTeacher, Supervisor, GradeLevel
from .serializers import ExtendUserSerializer, OrganizationSerializer, StudentTeacherSerializer, SupervisorSerializer, GradeLevelSerializer
from rest_framework.decorators import api_view
from django.contrib.auth.models import User

@api_view(['POST'])
def generate_invitation(request):
    max_uses = request.data.get('max_uses', None) 
    role = request.data.get('role')
    userid = request.data.get('userid')
    if not userid:
        return Response({'error': 'User ID is required'}, status=400)

    # Ensure user exists before creating invitation
    try:
        teacher = User.objects.get(username=userid)
    except User.DoesNotExist:
        return Response({'error': 'Teacher not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if user is authorized
    if ExtendUser.objects.filter(user=teacher, role__in=['Supervisor', 'Admin']).exists() is False:
        return Response({'error': 'Not Authorized'}, status=status.HTTP_401_UNAUTHORIZED)

    # Check if invitation already exists
    invitation = Invitation.objects.filter(teacher=teacher).first()
    if invitation:
        return Response(InvitationSerializer(invitation).data)
    
    if role == 'Supervisor':
        newrole = 'Student Teacher'
    else: 
        newrole = 'Supervisor'
        
    invitation = Invitation.objects.create(teacher=teacher, role=newrole, max_uses=max_uses)
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
            token = jwt.encode({
                'role': ExtendUser.objects.get(user=user).role, 
                'id': user.username, 
                'firstname': user.first_name, 
                'lastname': user.last_name,
                'org': ExtendUser.objects.get(user=user).org
                }, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
            return Response({"token": token}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def get_extend_users(request):
    extend_users = ExtendUser.objects.all()
    serializer = ExtendUserSerializer(extend_users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_organizations(request):
    organizations = Organization.objects.all()
    serializer = OrganizationSerializer(organizations, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_student_teachers(request):
    student_teachers = StudentTeacher.objects.all()
    serializer = StudentTeacherSerializer(student_teachers, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_supervisors(request):
    supervisors = Supervisor.objects.all()
    serializer = SupervisorSerializer(supervisors, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_grade_levels(request):
    grade_levels = GradeLevel.objects.all()
    serializer = GradeLevelSerializer(grade_levels, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def create_student_teacher(request):
    serializer = StudentTeacherSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(["POST"])
def create_supervisor(request):
    serializer = SupervisorSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(["POST"])
def create_grade_levels(request):
    serializer = GradeLevelSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(["GET"])
def get_users_by_role(request):
    """Retrieve a user's role based on their username"""
    username = request.GET.get("username", "").strip()

    if not username:
        return Response({"error": "username parameter is required"}, status=400)

    # Find user in ExtendUser model
    try:
        user = ExtendUser.objects.select_related('user').get(user__username=username)
    except ExtendUser.DoesNotExist:
        return Response({"error": f"User '{username}' not found"}, status=404)

    # Return user's role
    return Response({"username": username, "The user's role": user.role}, status=200)