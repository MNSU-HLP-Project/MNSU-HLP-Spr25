from django.db import models
from django.contrib.auth.models import User
from datetime import date

class HLP(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True)
    prompt = models.ManyToManyField('Prompt', blank=True)  # HLP-specific prompts

    def __str__(self):
        return self.name

class Prompt(models.Model):
    prompt = models.TextField()

    def __str__(self):
        return self.prompt  

class Entry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)  # person who is going to write the entry
    hlp = models.ForeignKey(HLP, on_delete=models.CASCADE, null=True, blank=True)  # Selected HLP
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

    def __str__(self):
        return f"Entry {self.id} - {self.user.username}"

class SupervisorClass(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    students = models.ManyToManyField(User, related_name='students')
    prompt_override = models.BooleanField(default=False)
    prompt_list = models.ManyToManyField('Prompt', blank=True)

    def __str__(self):
        return self.name

class Answer(models.Model):
    """The Answer is what a student writes in response to an Entry."""
    entry = models.OneToOneField(Entry, on_delete=models.CASCADE)  # One Answer per Entry
    prompt = models.ForeignKey(Prompt, on_delete=models.CASCADE)  # Explicitly store the prompt
    text = models.TextField()  # What the student writes in response

    def save(self, *args, **kwargs):
        if not self.prompt:
            self.prompt = self.entry.prompt  # Ensure the prompt is taken from Entry

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Answer to Entry {self.entry.id}"

class TeacherComment(models.Model):
    """Comments left by supervisors on student-teacher entries."""
    entry = models.ForeignKey(Entry, on_delete=models.CASCADE, null=True, blank=True)  # Entry being commented on
    supervisor = models.ForeignKey(SupervisorClass, on_delete=models.CASCADE, null=True, blank=True)  # Supervisor who wrote the comment
    comment = models.TextField()
    score = models.IntegerField()
    date = models.DateField(default=date.today)
    seen = models.BooleanField(default=False)

    def __str__(self):
        return f"Comment by {self.supervisor.user.username} on Entry {self.entry.id} - Score: {self.score}"
