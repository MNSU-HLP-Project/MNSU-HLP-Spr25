from django.contrib import admin
from .models import ExtendUser, Invitation, StudentTeacher, Organization, Supervisor, GradeLevel, SupervisorClass
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User


# Define an inline admin descriptor for Employee model
# which acts a bit like a singleton
class EmployeeInline(admin.StackedInline):
    model = ExtendUser
    can_delete = False
    verbose_name_plural = "employee"


# Define a new User admin
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'first_name', 'last_name', 'email', 'role', 'org')

    # Custom method to fetch the role from the related ExtendUser
    def role(self, obj):
        try:
            return obj.extend_user.role  # Access the ExtendUser's role
        except ExtendUser.DoesNotExist:
            return None  # Return None if no related ExtendUser exists

    # Custom method to fetch the org from the related ExtendUser
    def org(self, obj):
        try:
            return obj.extend_user.org  # Access the ExtendUser's org
        except ExtendUser.DoesNotExist:
            return None  # Return None if no related ExtendUser exists
    inlines = [EmployeeInline]


# Register Invitation
@admin.register(Invitation)
class InvitationAdmin(admin.ModelAdmin):
    list_display = ('code', 'teacher', 'max_uses','use_count', 'created_at')
    search_fields = ('code', 'teacher__username')
# Re-register UserAdmin
try:
    admin.site.unregister(User)
except:
    print('Didnt work')
admin.site.register(User, UserAdmin)
admin.site.register(SupervisorClass)
admin.site.register(StudentTeacher)
admin.site.register(Supervisor)
admin.site.register(Organization)
admin.site.register(GradeLevel)
