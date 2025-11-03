from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login
from user_auth.auth_backend import IsAdmin, IsStudentTeacher, IsSupervisor, IsSuperuser, IsSupervisorOrAdminOrSuperuser
from rest_framework.permissions import AllowAny
from .serializers import SignupSerializer, LoginSerializer, InvitationSerializer, OTPVerificationSerializer, PasswordResetRequestSerializer, PasswordResetSerializer
import jwt
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, renderer_classes
from django.conf import settings
from datetime import datetime, timedelta, timezone
from .models import ExtendUser, Invitation, Organization, StudentTeacher, Supervisor,  SupervisorClass, EmailOTP
from .serializers import ExtendUserSerializer, CurrentUserSerializer, SupervisorClassSerializer, OrganizationSerializer, StudentTeacherSerializer, SupervisorSerializer
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer
from entries.serializers import PromptSerializer


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
@permission_classes([IsSupervisor])
def get_class_details(request):
    user = request.user
    class_name = request.query_params.get('class_name')
    sup_class = SupervisorClass.objects.filter(user=user, name=class_name).first()
    serializer = SupervisorClassSerializer(sup_class)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsSupervisor])
def edit_class(request):
    """Edit a class"""
    # Get User
    user = request.user
    # Get class user is under
    sup_class = SupervisorClass.objects.filter(name = request.data['class_name'], user=user).first()
    if sup_class:
        # Get the class details from request data
        prompt_override = request.data['prompt_override']
        prompts = request.data['prompts']

        prompt_list = sup_class.prompt_list
        # First clear the prompt list
        prompt_list.clear()
        for prompt in prompts:
            # See if a prompt exists
            prompt_data = Prompt.objects.filter(prompt=prompt).first()
            # If not create a new one and add
            if not prompt_data:
               prompt_data = Prompt.objects.create(prompt=prompt) 
            prompt_list.add(prompt_data)
            
        sup_class.prompt_override = prompt_override
        sup_class.save()
        return Response('Class Updated Succesfully')      
    # If no org exists that means that the user is not associated to an org
    return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED) 
    
@api_view(['GET'])
@permission_classes([IsStudentTeacher])
def get_prompts_student(request):
    user = request.user
    student = StudentTeacher.objects.get(user=user)
    sup_class = student.class_name
    override = sup_class.prompt_override
    if override:
        prompt_list = sup_class.prompt_list
    else:
        org = ExtendUser.objects.get(user=user).org
        prompt_list = org.prompt_list
    serializer = PromptSerializer(prompt_list, many=True)
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
    
@api_view(['POST'])
@permission_classes([IsSupervisor])
def delete_class(request):
    user = request.user
    class_to_delete = SupervisorClass.objects.filter(user=user, name=request.data['class_name']).first()
    if class_to_delete:
        class_to_delete.delete()
        return Response('Succesfully Deleted Class')
    return Response(status=status.HTTP_400_BAD_REQUEST,data={'error':'No class with that name exists'})

@api_view(['GET'])
@permission_classes([IsAdmin])
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
        org.save()
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
            user = serializer.save()
            
            # Send OTP for email verification
            from .email_utils import create_and_send_otp
            otp = create_and_send_otp(user.email, 'signup', user)
            
            if otp:
                return Response({
                    "message": "Account created successfully! Please check your email for verification code.",
                    "email_sent": True,
                    "user_email": user.email
                }, status=status.HTTP_201_CREATED)
            else:
                # User created but email failed - they can request a new OTP
                return Response({
                    "message": "Account created but failed to send verification email. Please request a new verification code.",
                    "email_sent": False,
                    "user_email": user.email
                }, status=status.HTTP_201_CREATED)
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
            
            # Get or create ExtendUser if it doesn't exist (for backwards compatibility)
            # This handles cases where superusers were created manually
            extend_user, created = ExtendUser.objects.get_or_create(
                user=user,
                defaults={
                    'role': 'Superuser' if user.is_superuser else 'StudentTeacher'
                }
            )
            
            # Set up token here, 'exp' -  pyjwt built in functionality for expiration
            token = jwt.encode({
                'role': extend_user.role, 
                'id': user.username, 
                'firstname': user.first_name, 
                'lastname': user.last_name,
                'exp': datetime.now(tz=timezone.utc) + timedelta(hours=2) 
                }, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
            # Return token and role as role effects main menu
            return Response({"token": token, "role": extend_user.role}, status=status.HTTP_200_OK)
        # Return error
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


## I dont think anything under here is getting used right now, we will need to confirm

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
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error: {e}") #add more detailed logging here.
        return Response({'error': 'An error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

"""Added this to get students from specific class"""  
@api_view(["GET"])
def get_students_in_class(request, class_id):
    try:
        sup_class = SupervisorClass.objects.get(id=class_id)
        students = sup_class.students.all()
        serializer = CurrentUserSerializer(students, many=True)
        return Response(serializer.data, status=200)
    except SupervisorClass.DoesNotExist:
        return Response({"error": "Class not found"}, status=404)




@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_class_byid(request, class_id):
    try:
        sup_class = SupervisorClass.objects.get(id=class_id)
        return Response({"name": sup_class.name})
    except SupervisorClass.DoesNotExist:
        return Response({"error": "Class not found"}, status=404)

# Email Authentication Views

class SendOTPView(APIView):
    """Send OTP for email verification or password reset"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        otp_type = request.data.get('otp_type', 'signup')
        
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if otp_type not in ['signup', 'password_reset']:
            return Response({"error": "Invalid OTP type"}, status=status.HTTP_400_BAD_REQUEST)
        
        # For password reset, check if user exists
        if otp_type == 'password_reset':
            try:
                user = User.objects.get(email=email.lower())
            except User.DoesNotExist:
                return Response({"error": "No account found with this email address"}, status=status.HTTP_404_NOT_FOUND)
        else:
            user = None
        
        from .email_utils import create_and_send_otp
        
        otp = create_and_send_otp(email.lower(), otp_type, user)
        
        if otp:
            return Response({
                "message": f"OTP sent successfully to {email}",
                "expires_in_minutes": getattr(settings, 'OTP_EXPIRY_MINUTES', 10)
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Failed to send OTP. Please try again."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyOTPView(APIView):
    """Verify OTP code"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = OTPVerificationSerializer(data=request.data)
        
        if serializer.is_valid():
            otp_obj = serializer.validated_data['otp_object']
            email = serializer.validated_data['email']
            otp_type = serializer.validated_data['otp_type']
            
            # For signup verification, activate the user
            if otp_type == 'signup':
                try:
                    user = User.objects.get(email=email.lower())
                    user.is_active = True
                    user.save()
                    return Response({
                        "message": "Email verified successfully! Your account is now active.",
                        "user_activated": True
                    }, status=status.HTTP_200_OK)
                except User.DoesNotExist:
                    return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            
            # For password reset, just confirm verification
            elif otp_type == 'password_reset':
                return Response({
                    "message": "OTP verified successfully. You can now reset your password.",
                    "verified": True
                }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetRequestView(APIView):
    """Request password reset OTP"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            from .email_utils import create_and_send_otp
            
            user = User.objects.get(email=email.lower())
            otp = create_and_send_otp(email.lower(), 'password_reset', user)
            
            if otp:
                return Response({
                    "message": f"Password reset code sent to {email}",
                    "expires_in_minutes": getattr(settings, 'OTP_EXPIRY_MINUTES', 10)
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Failed to send reset code. Please try again."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetView(APIView):
    """Reset password with OTP verification"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            new_password = serializer.validated_data['new_password']
            
            try:
                user = User.objects.get(email=email.lower())
                user.set_password(new_password)
                user.save()
                
                return Response({
                    "message": "Password reset successfully! You can now login with your new password."
                }, status=status.HTTP_200_OK)
                
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
