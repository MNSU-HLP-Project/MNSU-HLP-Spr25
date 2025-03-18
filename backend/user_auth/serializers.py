from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Submission, Announcement, ExtendUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class SubmissionSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    
    class Meta:
        model = Submission
        fields = [
            'id',
            'student',
            'title',
            'content',
            'status',
            'feedback',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['student', 'status', 'feedback']

class AnnouncementSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Announcement
        fields = [
            'id',
            'title',
            'content',
            'author',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['author']
