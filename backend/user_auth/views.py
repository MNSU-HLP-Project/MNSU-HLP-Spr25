from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login
from user_auth.auth_backend import IsAdmin, IsStudentTeacher, IsSupervisor, IsSuperuser, IsSupervisorOrAdminOrSuperuser
from rest_framework.permissions import AllowAny
from .serializers import SignupSerializer, LoginSerializer, InvitationSerializer
import jwt
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, renderer_classes
from django.conf import settings
from datetime import datetime, timedelta, timezone
from .models import ExtendUser, Invitation, Organization, StudentTeacher, Supervisor, GradeLevel, SupervisorClass
from .serializers import ExtendUserSerializer, CurrentUserSerializer, SupervisorClassSerializer, GradeLevelSerializer, OrganizationSerializer, StudentTeacherSerializer, SupervisorSerializer
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer


from entries.models import Prompt

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
@permission_classes([AllowAny])
def get_grade_levels(request):
    """Gets grade levels for the whole database
        Currently grade levels are the same throughout the whole application
    """
    grade_levels = GradeLevel.objects.all()
    serializer = GradeLevelSerializer(grade_levels, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsSupervisorOrAdminOrSuperuser])
def get_class_names(request):
    """Get Classes that are under the request's user"""
    user = request.user
    classes = SupervisorClass.objects.filter(user=user)
    serializer = SupervisorClassSerializer(classes, many=True)
    return Response(serializer.data)
    
@api_view(['POST'])
@permission_classes([IsSuperuser])
def update_grades(request):
    """Update the grades list, this should only be accessed by a superuser"""
    grades = request.data['grades']
    # Currently deletes all of the grade levels but could be fixed to check
    # I don't think this matters much as it is only going to be accessed by the superusers and very rarely
    GradeLevel.objects.all().delete()
    for grade in grades:
        GradeLevel.objects.create(gradelevel = grade)
    return Response('Grades Updated Successfully')
    
@api_view(['POST'])
@permission_classes([IsSupervisor])
def generate_class(request):
    """Generate a class for a supervisor

    Args:
        request (_type_): contains user of supervisor doing the request

    Returns:
        Response: Either the class name with a 200 status or an error with 400 status
    """
    data = request.data['form_data']
    class_name = data['class_name']
    user = request.user
    sup_class = SupervisorClass.objects.filter(name=class_name, user=user).first()
    if sup_class:
        return Response({'error': "Class already exists"}, status=400)
    else:
        sup_class = SupervisorClass.objects.create(name=class_name, user=user)
        return Response({ class_name: SupervisorClassSerializer(sup_class).data})


@api_view(['POST'])
@permission_classes([IsSuperuser])
def generate_org(request):
    """Generates organization for a superuser.
    
    Args:
        request: Should include org_data object that has admin_email and org_name on it
    """
    # Get the data for the org
    org_data = request.data['org_data']
    admin = org_data['admin_email']
    name = org_data['org_name']
    # Check if it exists
    if Organization.objects.filter(name=name).first():
        return Response(status=status.HTTP_200_OK)
    # Otherwise create
    Organization.objects.create(name=name, admin_email=admin)
    return Response(status=status.HTTP_200_OK)
    
@api_view(['GET'])
@permission_classes([IsSuperuser])
def get_org_details(request):
    """Get details of the organization

    Args:
        request (_type_): Normal get request

    Returns:
        _type_: returns the prompts and organization data that is serialized
    """
    user = request.user
    org =  Organization.objects.filter(admin_email = user.email).first()
    if org:
        prompt_list = org.prompt_list
        prompts = []
        for prompt in prompt_list.all():
            prompts.append(prompt.prompt)
            
        return Response({ 'org_details': OrganizationSerializer(org).data,
                         'prompts': prompts})
    return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED) 
    
@api_view(['POST'])
@permission_classes([IsAdmin])
def edit_org(request):
    """Edit an organization"""
    # Get User
    user = request.user
    # Get organization user is under
    org =  Organization.objects.filter(admin_email = user.email).first()
    if org:
        # Get the org details from request data
        org_details = request.data['org_details']
        prompts = request.data['prompts']
        name = org_details['name']
        # Update the org
        org.name = name
        prompt_list = org.prompt_list
        # First clear the prompt list
        prompt_list.clear()
        for prompt in prompts:
            # See if a prompt exists
            prompt_data = Prompt.objects.filter(prompt=prompt).first()
            # If not create a new one and add
            if not prompt_data:
               prompt_data = Prompt.objects.create(prompt=prompt) 
            prompt_list.add(prompt_data)
        return Response('Organization Updated Succesfully')      
    # If no org exists that means that the user is not associated to an org
    return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED) 
   
@api_view(['POST'])
@permission_classes([IsSupervisorOrAdminOrSuperuser])
def generate_invitation(request, max=50):
    """Main invitation code generation"""
    # Just set to 50 right now, might want to change this in the future
    max_uses = max
    # class_name will always be passed but that does not mean that there will always be something there
    class_name = request.data['class_name']
    
    # Get role
    teacher = request.user
    role = ExtendUser.objects.get(user=teacher).role
    
    # Get org
    org = ExtendUser.objects.get(user=teacher).org

    # Check if user is one of authorized roles
    if ExtendUser.objects.filter(user=teacher, role__in=['Supervisor', 'Admin','Superuser']).exists() is False:
        return Response({'error': 'Not Authorized'}, status=status.HTTP_401_UNAUTHORIZED)

    # TODO: Might want to not hard code this
    if role == 'Supervisor':
        # If supervisor we need to handle classes, check if it exists
        invitation = Invitation.objects.filter(teacher=teacher, class_name=SupervisorClass.objects.get(name=class_name, user=teacher)).first()
        # If the invitation is valid, pass to serializer and then return it
        if invitation and invitation.use_count < invitation.max_uses:
            return Response({'invitation':InvitationSerializer(invitation).data})
        # If invitation is valid but has been used to max, delete and recreate later
        elif invitation and invitation.use_count >= invitation.max_uses:
            invitation.delete()
        # Set up for invitation
        newrole = 'Student Teacher'
        sup_class = SupervisorClass.objects.get(name=class_name, user=teacher)
    else: 
        # Look for an invitation first
        invitation = Invitation.objects.filter(teacher=teacher).first()
        # If valid return info
        if invitation and invitation.use_count < invitation.max_uses:
            return Response({'invitation':InvitationSerializer(invitation).data})
        # If valid and maxed out delete
        elif invitation and invitation.use_count >= invitation.max_uses:
            invitation.delete()
        # Handle role for invitation
        if role == 'Superuser':
            newrole = 'Admin'
            org = None
        else:
            newrole = 'Supervisor'
        sup_class = None
    
    # Create the invitation
    invitation = Invitation.objects.create(teacher=teacher, role=newrole, max_uses=max_uses, org=org, class_name=sup_class)
    return Response({'invitation': InvitationSerializer(invitation).data})


class SignupView(APIView):
    permission_classes = [AllowAny]
    # Class based view, might want to shift
    def post(self, request):
        # Signup logic is handled in the serializer
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Account created successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]
    """Login function is class based, just validates through a post request and returns a jwt if valid"""
    # Class based view, might want to shift
    def post(self, request):
        # Login Serializer takes request data and validates
        serializer = LoginSerializer(data=request.data)
        # If email/username and password are correct, then return jwt
        if serializer.is_valid():
            user = serializer.validated_data
            # Set up token here, 'exp' -  pyjwt built in functionality for expiration
            token = jwt.encode({
                'role': ExtendUser.objects.get(user=user).role, 
                'id': user.username, 
                'firstname': user.first_name, 
                'lastname': user.last_name,
                'exp': datetime.now(tz=timezone.utc) + timedelta(hours=2) 
                }, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
            # Return token and role as role effects main menu
            return Response({"token": token, "role": ExtendUser.objects.get(user=user).role}, status=status.HTTP_200_OK)
        # Return error
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


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_classes_by_loggedin_supervisor(request):
    user = request.user
    if hasattr(user, 'supervisor'):
        classes = SupervisorClass.objects.filter(user=user)
        serializer = SupervisorClassSerializer(classes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'You are not a supervisor.'}, status=status.HTTP_403_FORBIDDEN)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
@renderer_classes([JSONRenderer])
def get_students_under_supervisor(request):
    try:
        user = request.user
        if not hasattr(user, 'supervisor'):
            return Response({'error': 'You are not a supervisor.'}, status=status.HTTP_403_FORBIDDEN)
        supervisor = user.supervisor
        students = supervisor.student_teachers.all()
        serializer = StudentTeacherSerializer(students, many=True)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error: {e}") #add more detailed logging here.
        return Response({'error': 'An error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

"""Added this to get students from specific class"""  
@api_view(["POST"])
def get_students_in_class(request):
    class_obj = request.data.get("class_obj")  # Or class_name if you prefer

    if not class_obj:
        return Response({"error": "Class ID is required"}, status=400)
    user = User.objects.get(id=class_obj['user'])
    class_name = class_obj['name']
    try:
        sup_class = SupervisorClass.objects.get(name=class_name, user=user)
        students = sup_class.students
        serializer = CurrentUserSerializer(students, many=True)
        return Response(serializer.data, status=200)
    except SupervisorClass.DoesNotExist:
        return Response({"error": "Class not found"}, status=404)
