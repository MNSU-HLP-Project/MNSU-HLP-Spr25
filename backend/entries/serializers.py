from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Entry, TeacherComment, Notification

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class EntrySerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Entry
        fields = '__all__'

class TeacherCommentSerializer(serializers.ModelSerializer):
    teacher_details = UserSerializer(source='teacher', read_only=True)

    class Meta:
        model = TeacherComment
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Notification
        fields = '__all__'