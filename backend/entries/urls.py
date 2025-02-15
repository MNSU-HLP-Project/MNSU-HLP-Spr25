from django.urls import path
from .views import get_entries, create_entry, delete_entry

urlpatterns = [
    path("entries/", get_entries, name="entries-list"),  # GET all entries
    path("create-entry/", create_entry, name="create-entry"),  # POST new entry
    path("delete-entry/<int:id>/", delete_entry, name="delete-entry"),  # DELETE an entry
]
