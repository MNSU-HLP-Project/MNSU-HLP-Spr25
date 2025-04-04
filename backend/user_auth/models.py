from django.db import models
from django.contrib.auth.models import User
import uuid

class Organization(models.Model):
    name = models.CharField(max_length=255, unique=True)
    members = models.ManyToManyField(User, related_name='organizations')
    admin_email = models.CharField(max_length=50)
    prompt_list = models.ManyToManyField('entries.Prompt', related_name='prompt_lists')
    email_check = models.CharField(max_length=50)

    def get_all_prompts(self):
        from entries.models import Prompt
        from django.db.models import Q
        return Prompt.objects.filter(Q(is_default=True) | Q(organization=self))

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

    class Meta:
        verbose_name = "Supervisor Class"
        verbose_name_plural = "Supervisor Classes"
    def __str__(self):
        return self.name
    
class StudentTeacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_teacher')

    TEACHER_TYPE_CHOICES = [
        ('GE', 'General Educator'),
        ('SE', 'Special Educator'),
    ]
    type_of_teacher = models.CharField(max_length=2, choices=TEACHER_TYPE_CHOICES)
    grade_levels = models.ManyToManyField(GradeLevel)
    """added this coz of an error in the new signupview"""
    # class_name = models.ForeignKey(SupervisorClass, on_delete=models.CASCADE, null=True, blank=True)


    def __str__(self):
        return self.user.username

class Supervisor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='supervisor')
    student_teachers = models.ManyToManyField(StudentTeacher)

    def __str__(self):
        return self.user.username

class Invitation(models.Model):
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='invitations')
    code = models.UUIDField(default=uuid.uuid4, unique=True)
    org = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True)
    role = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    max_uses = models.PositiveIntegerField(null=True, blank=True)
    use_count = models.PositiveIntegerField(default=0)
    class_name = models.ForeignKey(SupervisorClass, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.teacher.username
