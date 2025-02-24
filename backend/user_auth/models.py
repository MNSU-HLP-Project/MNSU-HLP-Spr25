from django.db import models
from django.contrib.auth.models import User

class Organization(models.Model):
    name = models.CharField(max_length=255, unique=True)  # Organization Name Instead of User
    members = models.ManyToManyField(User, related_name='organizations')  # Users linked to an Organization

    def __str__(self):
        return self.name

class ExtendUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='extend_user')
    role = models.CharField(max_length=100)
    org = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True)  

    def __str__(self):
        return self.user.username

class GradeLevel(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class StudentTeacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_teacher') 

    TEACHER_TYPE_CHOICES = [
        ('GE', 'General Educator'),
        ('SE', 'Special Educator'),
    ]

    type_of_teacher = models.CharField(max_length=2, choices=TEACHER_TYPE_CHOICES)
    org = models.ForeignKey(Organization, on_delete=models.CASCADE)
    grade_levels = models.ManyToManyField(GradeLevel, blank=True)

    def __str__(self):
        return self.user.name

class Supervisor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='supervisor')  # Unique related_name
    student_teachers = models.ManyToManyField(StudentTeacher)  # Allow supervising multiple student teachers

    def __str__(self):
        return self.user.name
