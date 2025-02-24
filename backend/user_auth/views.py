from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login
from .serializers import SignupSerializer, LoginSerializer
import jwt
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.conf import settings
from .models import ExtendUser, Organization, StudentTeacher, Supervisor, GradeLevel
from .serializers import ExtendUserSerializer, OrganizationSerializer, StudentTeacherSerializer, SupervisorSerializer, GradeLevelSerializer

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