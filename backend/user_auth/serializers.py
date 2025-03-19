from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import ExtendUser, Invitation, Organization, StudentTeacher, Supervisor, GradeLevel, SupervisorClass

class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = ['id', 'teacher', 'role', 'code', 'created_at', 'max_uses', 'use_count','class_name']

class SuperClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupervisorClass
        fields = ['user', 'name']
               
class SignupSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    # organization = serializers.CharField(source='org')
    invitation_code = serializers.UUIDField(required=True)
    grade_level = serializers.CharField(required=False, allow_blank=True)
    type_of_educator = serializers.CharField(source='type_of_teacher', required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['firstName', 'lastName', 'email', 'password', 'invitation_code', 'grade_level', 'type_of_educator']

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
        org = invitation.org

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
            stuteach = StudentTeacher.objects.create(user=user, type_of_teacher=validated_data['type_of_teacher'])
            stuteach.grade_levels.add(GradeLevel.objects.get(gradelevel=validated_data['grade_level']))
            sup = Supervisor.objects.filter(user=invitation.teacher).first()
            class_name = invitation.class_name
            sup_class = SupervisorClass.objects.get(name=class_name, user=invitation.teacher)
            sup_class.students.add(user)
            if sup:
                sup.student_teachers.add(StudentTeacher.objects.get(user=user))
            else:
                Supervisor.objects.create(user=invitation.teacher)
                Supervisor.objects.get(user=invitation.teacher).student_teachers.add(StudentTeacher.objects.get(user=user))
      
        return user

class GradeLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = GradeLevel
        fields = '__all__' 

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password']) or authenticate(email=data['username'], password=data['password'])
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


class StudentTeacherSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Display username instead of ID
    org = OrganizationSerializer(read_only=True)  # Nested organization details


    class Meta:
        model = StudentTeacher
        fields = '__all__'

class SupervisorSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Show username instead of ID
    student_teachers = StudentTeacherSerializer(many=True, read_only=True)  # Show student teachers

    class Meta:
        model = Supervisor
        fields = '__all__'

