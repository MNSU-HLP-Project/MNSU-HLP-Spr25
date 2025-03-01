from django.urls import path
from .views import get_entries, create_entry, delete_entry, get_entries_by_lookfor_number, get_entries_by_date, get_entries_by_hlp

urlpatterns = [
    path("entries/", get_entries, name="entries-list"),  # GET all entries
    path("create-entry/", create_entry, name="create-entry"),  # POST new entry
    path("delete-entry/<int:id>/", delete_entry, name="delete-entry"),  # DELETE an entry
    path("entries/by-date/", get_entries_by_date, name= "get_entries_by_date"),
    path("entries/by-hlp/", get_entries_by_hlp, name= "get_entries_by_hlp"),
    path("entries/by-lookfor_number/", get_entries_by_lookfor_number, name = "get_entries_by_lookfor_number"),
]
