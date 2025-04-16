from django.db import models
from django.contrib.auth.models import User
from datetime import date
from django.utils import timezone

class Prompt(models.Model):
    prompt = models.CharField(max_length=200)
    is_default = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    organization = models.ForeignKey(
        'user_auth.Organization', on_delete=models.CASCADE, null=True, blank=True, related_name='custom_prompts'
    )

    def __str__(self):
        return f"{self.prompt} ({'Default' if self.is_default else 'Custom'})"

class PromptResponse(models.Model):
    prompt = models.TextField(blank=True, null=True)
    reflection = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Response to {self.prompt}"
    
class Entry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    hlp = models.TextField()
    lookfor_number = models.IntegerField(default=0)
    SCORE_CHOICES = [
        ('0', '0'),
        ('1', '1'),
        ('2', '2'),
        ('3', '3'),
        ('NA', 'Not Applicable'),
    ]
    score = models.CharField(max_length=2, choices=SCORE_CHOICES, default='NA')
    date = models.DateField(default=date.today)
    teacher_reply = models.BooleanField(default=False)

    # New fields for HLP submission workflow
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('revision', 'Needs Revision'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    week_number = models.PositiveIntegerField(default=1)
    # weekly_goal = models.TextField(blank=True, null=True)
    # criteria_for_mastery = models.TextField(blank=True, null=True)
    # goal_reflection = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    prompt_responses = models.ManyToManyField(PromptResponse, blank=True)
    class Meta:
        verbose_name = "Entry"
        verbose_name_plural = "Entries"

class TeacherComment(models.Model):
    entry = models.ForeignKey(Entry, on_delete=models.CASCADE, null=True, blank=True)
    supervisor = models.ForeignKey('user_auth.Supervisor', on_delete=models.CASCADE, null=True, blank=True)
    comment = models.TextField()
    score = models.IntegerField()
    date = models.DateField(default=date.today)
    seen = models.BooleanField(default=False)

    # New field to allow comments on specific prompts
    prompt_response = models.ForeignKey(PromptResponse, on_delete=models.CASCADE, null=True, blank=True, related_name='teacher_comments')

    def __str__(self):
        return f"Comment by {self.supervisor.user.username} on Entry {self.entry.id} - Score: {self.score}"
