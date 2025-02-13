from django.contrib import admin
from .models import Entry

class EntryAdmin(admin.ModelAdmin):
    list_display = ('hlp_number', 'date', 'score', 'comments')

admin.site.register(Entry, EntryAdmin)
