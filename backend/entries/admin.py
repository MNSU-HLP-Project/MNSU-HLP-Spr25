from django.contrib import admin
from .models import Entry, TeacherComment, Prompt, PromptResponse

class EntryAdmin(admin.ModelAdmin):
    list_display = ('hlp', 'date', 'lookfor_number', 'score', 'status', 'week_number')
    list_filter = ('status', 'week_number', 'date')
    search_fields = ('hlp', 'comments', 'weekly_goal')


class TeacherCommentAdmin(admin.ModelAdmin):
    list_display = ('entry', 'supervisor', 'score', 'date', 'seen')
    list_filter = ('seen', 'date')

admin.site.register(Entry, EntryAdmin)
admin.site.register(TeacherComment, TeacherCommentAdmin)
admin.site.register(Prompt)
admin.site.register(PromptResponse)
