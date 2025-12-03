from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, password_validation
from entries.serializers import PromptSerializer
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import ExtendUser, Invitation, Organization, StudentTeacher, Supervisor, SupervisorClass, EmailOTP

class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = ['id', 'teacher', 'role', 'code', 'created_at', 'max_uses', 'use_count','class_name']

class SupervisorClassSerializer(serializers.ModelSerializer):
    prompt_list = PromptSerializer(many=True)
    
    class Meta:
        model = SupervisorClass
        fields = ['user', 'name','prompt_override','prompt_list','id']


class SignupSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    invitation_code = serializers.UUIDField(required=True)
    grade_level = serializers.CharField(required=False, allow_blank=True)
    type_of_educator = serializers.CharField(source='type_of_teacher', required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['firstName', 'lastName', 'email', 'password', 'invitation_code', 'grade_level', 'type_of_educator']

    def create(self, validated_data):
        # Get inviation code to look up
        invitation_code = validated_data.pop('invitation_code')
        try:
            # If invitation code is there get it, if not error as url is incorrect
            invitation = Invitation.objects.get(code=invitation_code)
        except Invitation.DoesNotExist:
            raise serializers.ValidationError("Invalid invitation code.")
        
        # Get the invitation info from the database
        role = invitation.role
        org = invitation.org
        # If it is used to max, error out
        if invitation.max_uses and invitation.use_count >= invitation.max_uses:
            raise serializers.ValidationError("This invitation link has reached its maximum usage limit.")

        # If the user already exists error out
        if User.objects.filter(email=validated_data['email'].lower()).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})

        # If the role is admin, we need to make sure it matches the correct org admin email
        if role == 'Admin':
            admin_org = Organization.objects.filter(admin_email=validated_data['email'].lower()).first()
            if not admin_org:
                raise serializers.ValidationError({"email": "No Authorized Orginization"})
            else:
                org = admin_org
        
        errors = dict() 
        try:    
            password_validation.validate_password(validated_data['password'],user=None) 
        except DjangoValidationError as e:
            errors['password'] = list(e.messages)
        if errors:
            raise serializers.ValidationError(errors)
        
        user = User.objects.create_user(
            username=validated_data['email'].lower(),  # Use email as the username
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'].lower(),
            password=validated_data['password'],
            is_active=False  # User will be activated after email verification
        )
        
        # Create extend user to handle roles and organization
        if not hasattr(user, 'extend_user'):
            ExtendUser.objects.create(
                user=user,
                org=org,
                role=role
            )
        
        # Increment the invitation use count
        invitation.use_count += 1
        invitation.save()
        
        # if student teacher we need to register them with a class
        if role == 'Student Teacher':
            stuteach = StudentTeacher.objects.create(user=user, type_of_teacher=validated_data['type_of_teacher'], grade_level=validated_data['grade_level'])
            # Get info and look for a class
            sup = Supervisor.objects.filter(user=invitation.teacher).first()
            class_name = invitation.class_name
            sup_class = SupervisorClass.objects.get(name=class_name, user=invitation.teacher)
            stuteach.class_name = sup_class
            sup_class.students.add(user)
            stuteach.save()
            # Add student teacher to the supervisor
            if sup:
                sup.student_teachers.add(StudentTeacher.objects.get(user=user))
            else:
                new_teach = Supervisor.objects.create(user=invitation.teacher)
                new_teach.student_teachers.add(StudentTeacher.objects.get(user=user))
      
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        """Validate a username and password combo

        Args:
            data (_type_): the data should have 'username' and 'password'

        Raises:
            serializers.ValidationError: Invalid credentials (bad sign in)

        Returns:
            _type_: user when signed in
        """
        # Try to authenticate with username or email
        user = authenticate(username=data['username'], password=data['password']) or authenticate(email=data['username'], password=data['password'])
        
        if user:
            if not user.is_active:
                raise serializers.ValidationError("Your account is not active. Please verify your email address.")
            return user
        
        # For security, don't reveal if username/email exists or not
        raise serializers.ValidationError("Invalid credentials.")

class OrganizationSerializer(serializers.ModelSerializer):
    members = serializers.PrimaryKeyRelatedField(many=True, read_only=True)  # Show user IDs of members

    class Meta:
        model = Organization
        fields = '__all__'

class ExtendUserSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Returns username instead of ID
    org = OrganizationSerializer(read_only=True)  # Nested serialization for org

    class Meta:
        model = ExtendUser
        fields = '__all__'


class StudentTeacherSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Display username instead of ID
    # org = OrganizationSerializer(read_only=True)  # Nested organization details


    class Meta:
        model = StudentTeacher
        fields = ['user']

class CurrentUserSerializer(serializers.Serializer):
    """Serializer for Users
    """
    id = serializers.StringRelatedField()
    username = serializers.StringRelatedField()
    first_name = serializers.StringRelatedField()
    last_name = serializers.StringRelatedField()
    email = serializers.StringRelatedField()
    
    class Meta:
        model = User
        fields = ('username', 'email', 'id', 'first_name', 'last_name')
        
class SupervisorSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Show username instead of ID
    student_teachers = StudentTeacherSerializer(many=True, read_only=True)  # Show student teachers

    class Meta:
        model = Supervisor
        fields = ['id', 'name', 'students']

class CurrentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "username"]

class OTPVerificationSerializer(serializers.Serializer):
    """Serializer for OTP verification"""
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=10, min_length=6)
    otp_type = serializers.ChoiceField(choices=EmailOTP.OTP_TYPE_CHOICES)
    
    def validate(self, data):
        # For password_reset: only check, do not consume here. Consumption happens at reset.
        # For signup: consume immediately on verification.
        from .email_utils import verify_otp, check_otp
        
        email = data['email']
        otp_code = data['otp_code']
        otp_type = data['otp_type']
        
        if otp_type == 'password_reset':
            success, message, otp_obj = check_otp(email, otp_code, otp_type)
        else:
            success, message, otp_obj = verify_otp(email, otp_code, otp_type)
        
        if not success:
            raise serializers.ValidationError(message)
        
        data['otp_object'] = otp_obj
        return data

class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer for password reset request"""
    email = serializers.EmailField()
    
    def validate_email(self, value):
        try:
            user = User.objects.get(email=value.lower())
            if not user.is_active:
                raise serializers.ValidationError("Account is not active.")
        except User.DoesNotExist:
            raise serializers.ValidationError("No account found with this email address.")
        return value

class PasswordResetSerializer(serializers.Serializer):
    """Serializer for password reset with OTP"""
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=10, min_length=6)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        from .email_utils import verify_otp
        
        # Consume OTP at reset time
        success, message, otp_obj = verify_otp(data['email'], data['otp_code'], 'password_reset')
        if not success:
            raise serializers.ValidationError(message)
        
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        
        errors = dict()
        try:
            password_validation.validate_password(data['new_password'], user=None)
        except DjangoValidationError as e:
            errors['new_password'] = list(e.messages)
        
        if errors:
            raise serializers.ValidationError(errors)
        
        data['otp_object'] = otp_obj
        return data