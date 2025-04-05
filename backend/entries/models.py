from django.db import models
from django.contrib.auth.models import User
from datetime import date

class Prompt(models.Model):
    prompt = models.CharField(max_length=200)
    is_default = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    organization = models.ForeignKey(
        'user_auth.Organization', on_delete=models.CASCADE, null=True, blank=True, related_name='custom_prompts'
    )

    def __str__(self):
        return f"{self.prompt} ({'Default' if self.is_default else 'Custom'})"

class Entry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
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
        verbose_name = "Entry"
        verbose_name_plural = "Entries"

class Answer(models.Model):
    entry = models.OneToOneField(Entry, on_delete=models.CASCADE)
    prompt = models.ForeignKey(Prompt, on_delete=models.CASCADE)
    text = models.TextField()

    def save(self, *args, **kwargs):
        if not self.prompt:
            self.prompt = self.entry.prompt
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Answer to Entry {self.entry.id}"

class TeacherComment(models.Model):
    entry = models.ForeignKey(Entry, on_delete=models.CASCADE, null=True, blank=True)
    supervisor = models.ForeignKey('user_auth.Supervisor', on_delete=models.CASCADE, null=True, blank=True)
    comment = models.TextField()
    score = models.IntegerField()
    date = models.DateField(default=date.today)
    seen = models.BooleanField(default=False)

    def __str__(self):
        return f"Comment by {self.supervisor.user.username} on Entry {self.entry.id} - Score: {self.score}"
