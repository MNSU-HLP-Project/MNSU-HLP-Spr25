from django.db import models
from django.contrib.auth.models import User
import uuid

class Organization(models.Model):
    name = models.CharField(max_length=255, unique=True)  # Organization Name Instead of User
    members = models.ManyToManyField(User, related_name='organizations')  # Users linked to an Organization

    def __str__(self):
        return self.name

class ExtendUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='extend_user')
    role = models.CharField(max_length=100)
    org = models.ForeignKey(Organization, blank=True, null=True, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.user.username

class GradeLevel(models.Model):
    gradelevel = models.CharField(max_length=50, null=True)
    
    def __str__(self):
        return self.gradelevel
    
class SupervisorClass(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    students = models.ManyToManyField(User, related_name='students') 
    
    def __str__(self):
        return self.name

class StudentTeacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_teacher') 

    TEACHER_TYPE_CHOICES = [
        ('GE', 'General Educator'),
        ('SE', 'Special Educator'),
    ]

    type_of_teacher = models.CharField(max_length=2, choices=TEACHER_TYPE_CHOICES)
    # org = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True)
    grade_levels = models.ManyToManyField(GradeLevel)

    def __str__(self):
        return self.user.username

class Supervisor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='supervisor')  # Unique related_name
    student_teachers = models.ManyToManyField(StudentTeacher)  # Allow supervising multiple student teachers
    
    def __str__(self):
        return self.user.username

    
class Invitation(models.Model):
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='invitations')
    code = models.UUIDField(default=uuid.uuid4, unique=True)
    org = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True)
    role = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    max_uses = models.PositiveIntegerField(null=True, blank=True)  # Optional limit
    use_count = models.PositiveIntegerField(default=0)  # Track registrations
    class_name = models.ForeignKey(SupervisorClass, on_delete=models.CASCADE, blank=True, null=True)
    
    def __str__(self):
        return self.teacher.username
