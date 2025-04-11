from rest_framework import serializers
from .models import Entry, TeacherComment, Answer, Prompt, PromptResponse, EvidenceForMastery
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class PromptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prompt
        fields = '__all__'

class EvidenceForMasterySerializer(serializers.ModelSerializer):
    class Meta:
        model = EvidenceForMastery
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
    evidences = EvidenceForMasterySerializer(many=True, read_only=True)
    teacher_comments = serializers.SerializerMethodField()

    class Meta:
        model = Entry
        fields = ['id', 'user', 'user_detail', 'hlp', 'lookfor_number', 'score', 'date', 'comments',
                 'teacher_reply', 'status', 'week_number', 'weekly_goal', 'criteria_for_mastery',
                 'goal_reflection', 'created_at', 'updated_at', 'prompt_responses', 'evidences', 'teacher_comments']

    def get_teacher_comments(self, obj):
        comments = TeacherComment.objects.filter(entry=obj, prompt_response=None)
        return TeacherCommentSerializer(comments, many=True).data

# Create Entry with nested objects
class EntryCreateSerializer(serializers.ModelSerializer):
    prompt_responses = serializers.ListField(child=serializers.JSONField(), required=True)
    evidences = serializers.ListField(child=serializers.JSONField(), required=True)

    class Meta:
        model = Entry
        fields = ['user', 'hlp', 'lookfor_number', 'score', 'date', 'comments', 'weekly_goal',
                 'criteria_for_mastery', 'goal_reflection', 'week_number', 'prompt_responses', 'evidences']

    def create(self, validated_data):
        prompt_responses_data = validated_data.pop('prompt_responses', [])
        evidences_data = validated_data.pop('evidences', [])

        try:
            # Create the entry first
            entry = Entry.objects.create(**validated_data)

            # Create prompt responses
            for prompt_response_data in prompt_responses_data:
                # Ensure prompt exists
                prompt_id = prompt_response_data.get('prompt')
                if not prompt_id:
                    continue

                try:
                    # Try to get the prompt by ID
                    prompt = Prompt.objects.get(id=prompt_id)
                except Prompt.DoesNotExist:
                    # If prompt doesn't exist, create a new one with the ID and a default text
                    print(f"Creating new prompt for ID {prompt_id}")
                    prompt_text = "Reflection prompt"
                    if prompt_id == 1:
                        prompt_text = "How did you implement this HLP in your teaching?"
                    elif prompt_id == 2:
                        prompt_text = "What challenges did you face?"
                    elif prompt_id == 3:
                        prompt_text = "What would you do differently next time?"

                    prompt = Prompt.objects.create(
                        id=prompt_id,
                        prompt=prompt_text
                    )

                # Create the prompt response
                PromptResponse.objects.create(
                    entry=entry,
                    prompt=prompt,
                    indicator=prompt_response_data.get('indicator', 'na'),
                    reflection=prompt_response_data.get('reflection', '')
                )

            # Create evidences for mastery
            for i, evidence_data in enumerate(evidences_data):
                EvidenceForMastery.objects.create(
                    entry=entry,
                    text=evidence_data.get('text', ''),
                    order=evidence_data.get('order', i+1)
                )

            return entry

        except Exception as e:
            # Log the error for debugging
            print(f"Error creating entry: {str(e)}")
            raise serializers.ValidationError(f"Error creating entry: {str(e)}")

