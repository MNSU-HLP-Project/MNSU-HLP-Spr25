from django.contrib import admin
from .models import Entry, TeacherComment, Answer, Prompt, HLP, SupervisorClass

class EntryAdmin(admin.ModelAdmin):
    list_display = ('hlp', 'date','lookfor_number' ,'score', 'comments')

admin.site.register(Entry, EntryAdmin)
admin.site.register(TeacherComment)
admin.site.register(Answer)
admin.site.register(Prompt)
admin.site.register(HLP)
admin.site.register(SupervisorClass)
