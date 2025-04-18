from rest_framework import serializers
from .models import Entry, TeacherComment, Prompt, PromptResponse
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
    id = serializers.IntegerField()
    teacher_comments = serializers.SerializerMethodField()

    class Meta:
        model = PromptResponse
        fields = ['id', 'prompt', 'reflection', 'teacher_comments', 'entry_obj']

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

class EntrySerializer(serializers.ModelSerializer):
    user_detail = UserSerializer(source='user', read_only=True)
    prompt_responses = PromptResponseSerializer(many=True)
    teacher_comments = serializers.SerializerMethodField()

    class Meta:
        model = Entry
        fields = [
            'id', 'user_detail', 'prompt_responses', 'teacher_comments',
            'hlp', 'lookfor_number', 'score', 'date', 'status'
        ]
    
    def get_teacher_comments(self, obj):
        comments = TeacherComment.objects.filter(entry=obj, prompt_response=None)
        return TeacherCommentSerializer(comments, many=True).data

    def update(self, instance, validated_data):
        prompt_responses_data = validated_data.pop('prompt_responses', [])
        # Update Entry fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Process prompt_responses
        updated_responses = []
        for response_data in prompt_responses_data:
            response_id = response_data.get('id')
            print(response_id)
            print(response_data)
            if response_id:
                pr_instance = PromptResponse.objects.filter(id=response_id).first()
                if pr_instance:
                    for attr, val in response_data.items():
                        setattr(pr_instance, attr, val)
                    pr_instance.save()
                    updated_responses.append(pr_instance)
            else:
                new_pr = PromptResponse.objects.create(**response_data, entry_obj=instance)
                updated_responses.append(new_pr)

        instance.prompt_responses.set(updated_responses)  # update the M2M field

        return instance

# Create Entry with nested objects
class EntryCreateSerializer(serializers.ModelSerializer):
    prompt_responses = serializers.ListField(child=serializers.JSONField(), required=True)

    class Meta:
        model = Entry
        fields = ['id','prompt_responses','hlp','week_number','lookfor_number','score','date','user']

    def create(self, validated_data):
        prompt_responses_data = validated_data.pop('prompt_responses', [])

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
                response = PromptResponse.objects.create(
                    entry_obj = entry,
                    prompt=prompt.prompt,
                    reflection=prompt_response_data.get('reflection', '')
                )
                entry.prompt_responses.add(response)

            # Create evidences for mastery

            return entry

        except Exception as e:
            # Log the error for debugging
            print(f"Error creating entry: {str(e)}")
            raise serializers.ValidationError(f"Error creating entry: {str(e)}")

