from django.db import models
from django.contrib.auth.models import User


class ExtendUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='extend_user')
    role = models.CharField(max_length=100)
    org = models.CharField(max_length=100)
    
    def __str__(self):
        return self.user.username
