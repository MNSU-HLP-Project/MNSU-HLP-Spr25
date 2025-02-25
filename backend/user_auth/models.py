from django.db import models
from django.contrib.auth.models import User
import uuid

class Invitation(models.Model):
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='invitations')
    code = models.UUIDField(default=uuid.uuid4, unique=True)
    role = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    max_uses = models.PositiveIntegerField(null=True, blank=True)  # Optional limit
    use_count = models.PositiveIntegerField(default=0)  # Track registrations

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    teacher = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='students')


class ExtendUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='extend_user')
    role = models.CharField(max_length=100)
    org = models.CharField(max_length=100)
    
    def __str__(self):
        return self.user.username
