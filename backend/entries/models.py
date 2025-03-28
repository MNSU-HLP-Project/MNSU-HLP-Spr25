from django.db import models
from django.contrib.auth.models import User
from datetime import date
from user_auth.models import Supervisor, Prompt


class Entry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)  # person who is going to write the entry
    hlp = models.TextField()
    lookfor_number = models.IntegerField(default=0)
    
    SCORE_CHOICES = [
        ('0', '0'),
        ('1', '1'),
        ('2', '2'),
        ('NA', 'Not Applicable'),
    ]
    score = models.CharField(max_length=2, choices=SCORE_CHOICES, default='NA')
    date = models.DateField(default=date.today)
    comments = models.TextField(default="")
    teacher_reply = models.BooleanField(default=False)

    
    class Meta:
        verbose_name = "Entry"  # Ensures the singular name is used in admin
        verbose_name_plural = "Entries"  # Explicitly set plural form


class Answer(models.Model):
    """The Answer is what a student writes in response to an Entry."""
    entry = models.OneToOneField(Entry, on_delete=models.CASCADE)  # One Answer per Entry
    prompt = models.ForeignKey(Prompt, on_delete=models.CASCADE)  # Explicitly store the prompt
    text = models.TextField()  # What the student writes in response

    # def save(self, *args, **kwargs):
    #     if not self.prompt:
    #         self.prompt = self.entry.prompt  # Ensure the prompt is taken from Entry

    #     super().save(*args, **kwargs)

    def __str__(self):
        return f"Answer to Entry {self.entry.id}"
    
class TeacherComment(models.Model):
    """Comments left by supervisors on student-teacher entries."""
    entry = models.ForeignKey(Entry, on_delete=models.CASCADE, null=True, blank=True)  # Entry being commented on
    supervisor = models.ForeignKey(Supervisor, on_delete=models.CASCADE, null=True, blank=True)  # Supervisor who wrote the comment
    comment = models.TextField()
    score = models.IntegerField()
    date = models.DateField(default=date.today)
    seen = models.BooleanField(default=False)

    def __str__(self):
        return f"Comment by {self.supervisor.user.username} on Entry {self.entry.id} - Score: {self.score}"
