from rest_framework import serializers
from .models import Entry, TeacherComment, Answer, Prompt, PromptResponse
from user_auth.models import SupervisorClass
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class PromptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prompt
        fields = '__all__'



class PromptResponseSerializer(serializers.ModelSerializer):
    prompt_detail = PromptSerializer(source='prompt', read_only=True)
    teacher_comments = serializers.SerializerMethodField()

    class Meta:
        model = PromptResponse
        fields = ['id', 'entry', 'prompt', 'prompt_detail', 'indicator', 'reflection', 'teacher_comments']

    def get_teacher_comments(self, obj):
        comments = obj.teacher_comments.all()
        return TeacherCommentSerializer(comments, many=True).data

class TeacherCommentSerializer(serializers.ModelSerializer):
    supervisor_name = serializers.SerializerMethodField()

    class Meta:
        model = TeacherComment
        fields = ['id', 'entry', 'supervisor', 'supervisor_name', 'comment', 'score', 'date', 'seen', 'prompt_response']

    def get_supervisor_name(self, obj):
        if obj.supervisor and obj.supervisor.user:
            return f"{obj.supervisor.user.first_name} {obj.supervisor.user.last_name}"
        return ""

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'

class EntrySerializer(serializers.ModelSerializer):
    user_detail = UserSerializer(source='user', read_only=True)
    prompt_responses = PromptResponseSerializer(many=True, read_only=True)
    teacher_comments = serializers.SerializerMethodField()

    class Meta:
        model = Entry
        fields = '__all__'

    def get_teacher_comments(self, obj):
        comments = TeacherComment.objects.filter(entry=obj, prompt_response=None)
        return TeacherCommentSerializer(comments, many=True).data

# Create Entry with nested objects
class EntryCreateSerializer(serializers.ModelSerializer):
    prompt_responses = serializers.ListField(child=serializers.JSONField(), required=True)

    class Meta:
        model = Entry
        fields = [
            'user', 'hlp', 'lookfor_number', 'score', 'date', 'comments',
            'weekly_goal', 'goal_reflection', 'week_number', 'prompt_responses'
        ]
        read_only_fields = ['user']  # user will be taken from request context

    def create(self, validated_data):
        prompt_responses_data = validated_data.pop('prompt_responses', [])
        request = self.context.get('request')

        try:
            # Get user and class
            user = request.user
            sup_class = SupervisorClass.objects.get(students__id=user.id)

            # Set user and sup_class on entry
            validated_data['user'] = user
            validated_data['sup_class'] = sup_class

            # Create the entry
            entry = Entry.objects.create(**validated_data)

            # Handle prompt responses
            for prompt_response_data in prompt_responses_data:
                prompt_id = prompt_response_data.get('prompt')
                if not prompt_id:
                    continue

                try:
                    prompt = Prompt.objects.get(id=prompt_id)
                except Prompt.DoesNotExist:
                    prompt_text = "Reflection prompt"
                    if prompt_id == 1:
                        prompt_text = "How did you implement this HLP in your teaching?"
                    elif prompt_id == 2:
                        prompt_text = "What challenges did you face?"
                    elif prompt_id == 3:
                        prompt_text = "What would you do differently next time?"
                    prompt = Prompt.objects.create(id=prompt_id, prompt=prompt_text)

                PromptResponse.objects.create(
                    entry=entry,
                    prompt=prompt,
                    indicator=prompt_response_data.get('indicator', 'na'),
                    reflection=prompt_response_data.get('reflection', '')
                )

            return entry

        except SupervisorClass.DoesNotExist:
            raise serializers.ValidationError("Student is not enrolled in any class.")
        except Exception as e:
            print(f"Error creating entry: {str(e)}")
            raise serializers.ValidationError(f"Error creating entry: {str(e)}")

