from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import ExtendUser

class SignupSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    organization = serializers.CharField(write_only=True)
    role = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['firstName', 'lastName', 'email', 'password', 'organization', 'role']

    def create(self, validated_data):
        if User.objects.filter(email=validated_data['email']).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        
        organization = validated_data.pop('organization', '')
        role = validated_data.pop('role', '')
        
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        
        ExtendUser.objects.create(
            user=user,
            org=organization,
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
        raise serializers.ValidationError({"message": "Invalid email or password."})
