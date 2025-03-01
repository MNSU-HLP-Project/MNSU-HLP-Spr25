from django.db import models
from datetime import date
# from .models import User 

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
    comments = models.TextField()
    # user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    teacher_reply = models.BooleanField(default=False)

    def __str__(self):
        return f"Entry {self.id}: {self.comments[:20]}..."  # Shows first 20 characters

class TeacherComment(models.Model):
    entry = models.ForeignKey(Entry, on_delete=models.CASCADE)
    comment = models.TextField()
    score = models.IntegerField()
    date = models.DateField(default=date.today)
    seen = models.BooleanField(default=False)

    def __str__(self):
        return f"Comment on Entry {self.entry.id} - Score: {self.score}"