from django.contrib import admin
from .models import Entry, TeacherComment, Answer, Prompt, PromptResponse, EvidenceForMastery

class EntryAdmin(admin.ModelAdmin):
    list_display = ('hlp', 'date', 'lookfor_number', 'score', 'status', 'week_number')
    list_filter = ('status', 'week_number', 'date')
    search_fields = ('hlp', 'comments', 'weekly_goal')

class PromptResponseAdmin(admin.ModelAdmin):
    list_display = ('entry', 'prompt', 'indicator')
    list_filter = ('indicator',)

class EvidenceForMasteryAdmin(admin.ModelAdmin):
    list_display = ('entry', 'order')
    list_filter = ('order',)

class TeacherCommentAdmin(admin.ModelAdmin):
    list_display = ('entry', 'supervisor', 'score', 'date', 'seen')
    list_filter = ('seen', 'date')

admin.site.register(Entry, EntryAdmin)
admin.site.register(TeacherComment, TeacherCommentAdmin)
admin.site.register(Answer)
admin.site.register(Prompt)
admin.site.register(PromptResponse, PromptResponseAdmin)
admin.site.register(EvidenceForMastery, EvidenceForMasteryAdmin)
