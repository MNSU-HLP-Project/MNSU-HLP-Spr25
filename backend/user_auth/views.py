from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login
from .serializers import SignupSerializer, LoginSerializer, InvitationSerializer
import jwt
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, renderer_classes
from django.conf import settings
from .models import ExtendUser, Invitation, Organization, StudentTeacher, Supervisor, GradeLevel, SupervisorClass
from .serializers import ExtendUserSerializer, CurrentUserSerializer, SupervisorClassSerializer, GradeLevelSerializer, OrganizationSerializer, StudentTeacherSerializer, SupervisorSerializer
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer



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
def get_class_names(request):
    token = check_token(request.data['token'])
    userid = token['id']
    user = User.objects.get(username=userid)
    classes = SupervisorClass.objects.filter(user=user)
    serializer = SupervisorClassSerializer(classes, many=True)
    return Response(serializer.data)
    
@api_view(['POST'])
def generate_class(request):
    data = request.data['form_data']
    class_name = data['class_name']
    token = check_token(request.data['token'])
    userid = token['id']
    user = User.objects.get(username=userid)
    sup_class = SupervisorClass.objects.filter(name=class_name, user=user).first()
    if sup_class:
        return Response({'error': "Class already exists"}, status=400)
    else:
        sup_class = SupervisorClass.objects.create(name=class_name, user=user)
        return Response({ class_name: SupervisorClassSerializer(sup_class).data})


@api_view(['POST'])
def generate_org(request):
    token = check_token(request.data['token'])
    if token['role'] != 'Superuser':
        return Response({'error': 'User not authenticated'}, status=400)
    org_data = request.data['org_data']
    admin = org_data['admin_email']
    name = org_data['org_name']
    if Organization.objects.filter(name=name).first():
        return Response(status=status.HTTP_200_OK)
    Organization.objects.create(name=name, admin_email=admin)
    return Response(status=status.HTTP_200_OK)
    
    
@api_view(['POST'])
def generate_invitation(request):
    max_uses = 50
    token = check_token(request.data['token'])
    print(request.data)
    class_name = request.data['class_name']
    
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
    if ExtendUser.objects.filter(user=teacher, role__in=['Supervisor', 'Admin','Superuser']).exists() is False:
        return Response({'error': 'Not Authorized'}, status=status.HTTP_401_UNAUTHORIZED)

    # Check if invitation already exists
    if role == 'Supervisor':
        invitation = Invitation.objects.filter(teacher=teacher, class_name=SupervisorClass.objects.get(name=class_name, user=teacher)).first()
        if invitation and invitation.use_count < invitation.max_uses:
            return Response({'invitation':InvitationSerializer(invitation).data})
        elif invitation and invitation.use_count >= invitation.max_uses:
            invitation.delete()
        newrole = 'Student Teacher'
        sup_class = SupervisorClass.objects.get(name=class_name, user=teacher)
    else: 
        invitation = Invitation.objects.filter(teacher=teacher).first()
        if invitation and invitation.use_count < invitation.max_uses:
            return Response({'invitation':InvitationSerializer(invitation).data})
        elif invitation and invitation.use_count >= invitation.max_uses:
            invitation.delete()
        if role == 'Superuser':
            newrole = 'Admin'
            org = None
        else:
            newrole = 'Supervisor'
        sup_class = None
        
    invitation = Invitation.objects.create(teacher=teacher, role=newrole, max_uses=max_uses, org=org, class_name=sup_class)
    return Response({'invitation': InvitationSerializer(invitation).data})


class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Account created successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# """Updated the Signup view as students are not being assigned to class... didn't work :("""
# class SignupView(APIView):
#     def post(self, request):
#         serializer = SignupSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.save()

#             invitation_code = request.data.get("invitation_code")
#             if invitation_code:
#                 try: 
#                     invitation = Invitation.objects.get(code=invitation_code)
#                 except Invitation.DoesNotExist:
#                     return Response({"error": "Invalid invitation code"}, status=400)
                
#                 # Assign role and org from the invitation
#                 extend_user = ExtendUser.objects.get(user=user)
#                 extend_user.role = invitation.role
#                 extend_user.org = invitation.org
#                 extend_user.save()

#                 # If this is a student teacher, assign them to the class
#                 if invitation.role == "Student Teacher" and invitation.class_name:
#                     StudentTeacher.objects.create(
#                         user=user,
#                         class_name=invitation.class_name,
#                         grade_levels=request.data.get("grade_level"),
#                         type_of_teacher=request.data.get("type_of_educator")
#                     )

#             return Response({"message": "Account created successfully!"}, status=status.HTTP_201_CREATED)
        
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            token = jwt.encode({
                'role': ExtendUser.objects.get(user=user).role, 
                'id': user.username, 
                'firstname': user.first_name, 
                'lastname': user.last_name
                }, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
            return Response({"token": token, "role": ExtendUser.objects.get(user=user).role}, status=status.HTTP_200_OK)
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
