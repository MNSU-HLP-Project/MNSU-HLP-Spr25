from rest_framework import serializers
from .models import Entry, TeacherComment, Answer, Prompt

class EntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entry
        fields = '__all__'
class TeacherCommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = TeacherComment
        fields = '__all__'

class AnswerClassSerializer(serializers.ModelSerializer):

    class Meta:
        model = Answer
        fields = '__all__'
class PromptClassSerializer(serializers.ModelSerializer):

    class Meta:
        model = Prompt
        fields = '__all__'
               

