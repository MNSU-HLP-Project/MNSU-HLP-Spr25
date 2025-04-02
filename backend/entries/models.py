from django.db import models
from django.contrib.auth.models import User
from datetime import date
from django.utils import timezone

class Entry(models.Model):
    hlp = models.IntegerField(default = 0)
    lookfor_number = models.IntegerField(default=0)
    SCORE_CHOICES = [
    ('1', '1'),
    ('2', '2'),
    ('NA', 'Not Applicable'),
    ]

    score = models.CharField(max_length=2, choices=SCORE_CHOICES, default='NA')

    date = models.DateField(default=date.today)
    comments = models.TextField(default="")
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    teacher_reply = models.BooleanField(default=False)

    def __str__(self):
        return f"Entry {self.id}: {self.comments[:20]}..."  # Shows first 20 characters

class Prompt(models.Model):
    prompt = models.CharField(max_length=200)

class TeacherComment(models.Model):
    entry = models.ForeignKey(Entry, on_delete=models.CASCADE, related_name='teacher_comments')
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    comment = models.TextField()
    score = models.IntegerField()
    date = models.DateField(default=date.today)
    seen = models.BooleanField(default=False)

    def __str__(self):
        return f"Comment on Entry {self.entry.id} - Score: {self.score}"

class Notification(models.Model):
    # Notification types
    COMMENT = 'comment'
    ENTRY = 'entry'
    NOTIFICATION_TYPES = [
        (COMMENT, 'New Comment'),
        (ENTRY, 'New Entry'),
    ]

    # User who receives the notification
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')

    # Notification content
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=100)
    message = models.TextField()

    # Related objects
    entry = models.ForeignKey(Entry, on_delete=models.CASCADE, null=True, blank=True)
    comment = models.ForeignKey(TeacherComment, on_delete=models.CASCADE, null=True, blank=True)

    # Metadata
    created_at = models.DateTimeField(default=timezone.now)
    read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.notification_type}: {self.title}"