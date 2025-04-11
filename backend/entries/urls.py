from django.urls import path
from .views import (
    get_entries, create_entry, delete_entry,
    get_entries_by_lookfor_number, get_entries_by_date, get_entries_by_hlp,
    get_entries_by_supervisor_students, get_student_entries, get_entry_detail,
    add_teacher_comment, update_entry_status, get_prompts
)

urlpatterns = [
    # Basic entry endpoints
    path("entries/", get_entries, name="entries-list"),  # GET all entries
    path("create-entry/", create_entry, name="create-entry"),  # POST new entry
    path("delete-entry/<int:id>/", delete_entry, name="delete-entry"),  # DELETE an entry

    # Filter endpoints
    path("entries/by-date/", get_entries_by_date, name="get_entries_by_date"),
    path("entries/by-hlp/", get_entries_by_hlp, name="get_entries_by_hlp"),
    path("entries/by-lookfor_number/", get_entries_by_lookfor_number, name="get_entries_by_lookfor_number"),

    # HLP submission workflow endpoints
    path("supervisor/student-entries/", get_entries_by_supervisor_students, name="get_entries_by_supervisor_students"),
    path("student/entries/", get_student_entries, name="get_student_entries"),
    path("entries/<int:entry_id>/", get_entry_detail, name="get_entry_detail"),
    path("entries/<int:entry_id>/comment/", add_teacher_comment, name="add_teacher_comment"),
    path("entries/<int:entry_id>/status/", update_entry_status, name="update_entry_status"),
    path("prompts/", get_prompts, name="get_prompts"),
]
