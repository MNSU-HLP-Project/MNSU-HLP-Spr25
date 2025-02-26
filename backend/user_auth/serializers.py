from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import ExtendUser, Invitation, StudentProfile, Organization, StudentTeacher, Supervisor, GradeLevel

class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = ['id', 'teacher', 'role', 'code', 'created_at', 'max_uses', 'use_count']

class SignupSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    organization = serializers.CharField(source='org')
    invitation_code = serializers.UUIDField(required=True)
    
    class Meta:
        model = User
        fields = ['firstName', 'lastName', 'email', 'password', 'organization', 'invitation_code']

    def create(self, validated_data):
        invitation_code = validated_data.pop('invitation_code')
        try:
            invitation = Invitation.objects.get(code=invitation_code)
        except Invitation.DoesNotExist:
            raise serializers.ValidationError("Invalid invitation code.")
        role = invitation.role
        if invitation.max_uses and invitation.use_count >= invitation.max_uses:
            raise serializers.ValidationError("This invitation link has reached its maximum usage limit.")

        if User.objects.filter(email=validated_data['email'].lower()).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})
        org = validated_data.pop('org')

        user = User.objects.create_user(
            username=validated_data['email'].lower(),  # Use email as the username
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'].lower(),
            password=validated_data['password']
        )
        
        if not hasattr(user, 'extend_user'):
            ExtendUser.objects.create(
                user=user,
                org=org,
                role=role
            )
        
        invitation.use_count += 1
        invitation.save()
        if role == 'Student Teacher':
            StudentProfile.objects.create(user=user, teacher=invitation.teacher)
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if user and user.is_active:
            return user
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

class GradeLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = GradeLevel
        fields = '__all__'

class StudentTeacherSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Display username instead of ID
    org = OrganizationSerializer(read_only=True)  # Nested organization details
    grade_levels = GradeLevelSerializer(many=True, read_only=True)  # Show grade levels as objects

    class Meta:
        model = StudentTeacher
        fields = '__all__'

class SupervisorSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Show username instead of ID
    student_teachers = StudentTeacherSerializer(many=True, read_only=True)  # Show student teachers

    class Meta:
        model = Supervisor
        fields = '__all__'