from rest_framework import serializers
from .models import Announcement, User, Submission

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class AnnouncementSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Announcement
        fields = ['id', 'title', 'content', 'author', 'created_at', 'updated_at', 'is_active']
        read_only_fields = ['author', 'created_at', 'updated_at']

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['id', 'title', 'content', 'feedback', 'status', 'created_at']
        read_only_fields = ['feedback', 'status']
