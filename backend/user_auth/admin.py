from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import ExtendUser, Announcement

class ExtendUserInline(admin.StackedInline):
    model = ExtendUser
    can_delete = False
    verbose_name_plural = 'Extended User Info'

class CustomUserAdmin(UserAdmin):
    inlines = (ExtendUserInline,)
    list_display = ('email', 'username', 'get_role', 'get_organization', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active')

    def get_role(self, obj):
        try:
            return obj.extend_user.role
        except ExtendUser.DoesNotExist:
            return '-'
    get_role.short_description = 'Role'

    def get_organization(self, obj):
        try:
            return obj.extend_user.org
        except ExtendUser.DoesNotExist:
            return '-'
    get_organization.short_description = 'Organization'

# Unregister the default User admin
admin.site.unregister(User)
# Register User with our custom admin
admin.site.register(User, CustomUserAdmin)

@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at', 'updated_at')
    search_fields = ('title', 'content', 'author__username')
    list_filter = ('created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
