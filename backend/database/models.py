from django.db import models
from datetime import date
# from .models import User 

class Entries(models.Model):
    entry_id = models.IntegerField(default=0)
    hlp = models.IntegerField(default = 0)
    hlp = models.IntegerField(default=0)
    lookfor_number = models.IntegerField()
    date = models.DateField()
    comments = models.TextField()
    # user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    teacher_reply = models.BooleanField(default=False)

    def __str__(self):
        return f"Entry {self.id}: {self.comments[:20]}..."  # Shows first 20 characters

class TeacherComments(models.Model):
    teacher_comment_id = models.IntegerField(primary_key = True)
    entry_id = models.ForeignKey(Entries, on_delete=models.CASCADE)
    # user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    entry = models.ForeignKey(Entries, on_delete=models.CASCADE)
    comment = models.TextField()
    score = models.IntegerField()
    date = models.DateField()
    seen = models.BooleanField(default=False)

    def __str__(self):
        return f"Comment on Entry {self.entry.id} - Score: {self.score}"