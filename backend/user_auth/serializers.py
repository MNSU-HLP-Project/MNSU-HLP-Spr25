from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import ExtendUser

class SignupSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    organization = serializers.CharField(source='org')
    role = serializers.CharField()
    
    class Meta:
        model = User
        fields = ['firstName', 'lastName', 'email', 'password', 'organization', 'role']

    def create(self, validated_data):
        if User.objects.filter(email=validated_data['email']).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})
        org = validated_data.pop('org')
        role = validated_data.pop('role')
        
        print(org)
        user = User.objects.create_user(
            username=validated_data['email'],  # Use email as the username
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        if not hasattr(user, 'extend_user'):
            ExtendUser.objects.create(
                user=user,
                org=org,
                role=role
            )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        user = authenticate(username=data['email'], password=data['password'])
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials.")
