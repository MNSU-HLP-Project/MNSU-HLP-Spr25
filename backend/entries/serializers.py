from rest_framework import serializers
from .models import Entry, TeacherComment, SupervisorClass, Answer, Prompt, HLP

class EntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entry
        fields = '__all__'
class TeacherCommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = TeacherComment
        fields = '__all__'

class SuperClassSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Show username instead of ID
    class Meta:
        model = SupervisorClass
        fields = ['user', 'name']

class AnswerClassSerializer(serializers.ModelSerializer):

    class Meta:
        model = Answer
        fields = '__all__'

class PromptClassSerializer(serializers.ModelSerializer):

    class Meta:
        model = Prompt
        fields = '__all__'

class HLPClassSerializer(serializers.ModelSerializer):

    class Meta:
        model = HLP
        fields = '__all__'