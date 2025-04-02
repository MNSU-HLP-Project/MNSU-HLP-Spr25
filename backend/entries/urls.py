from django.urls import path
from .views import get_entries, create_entry, delete_entry, get_entries_by_lookfor_number, get_entries_by_date, get_entries_by_hlp, get_user_entries, get_entry_comments, add_comment, get_notifications, mark_notification_read, mark_all_notifications_read

urlpatterns = [
    path("entries/", get_entries, name="entries-list"),  # GET all entries
    path("user-entries/", get_user_entries, name="user-entries"),  # POST to get user's entries
    path("create-entry/", create_entry, name="create-entry"),  # POST new entry
    path("delete-entry/<int:id>/", delete_entry, name="delete-entry"),  # DELETE an entry
    path("entries/by-date/", get_entries_by_date, name= "get_entries_by_date"),
    path("entries/by-hlp/", get_entries_by_hlp, name= "get_entries_by_hlp"),
    path("entries/by-lookfor_number/", get_entries_by_lookfor_number, name = "get_entries_by_lookfor_number"),
    path("entry-comments/<int:entry_id>/", get_entry_comments, name="entry-comments"),
    path("add-comment/<int:entry_id>/", add_comment, name="add-comment"),
    path("notifications/", get_notifications, name="notifications"),
    path("mark-notification-read/<int:notification_id>/", mark_notification_read, name="mark-notification-read"),
    path("mark-all-notifications-read/", mark_all_notifications_read, name="mark-all-notifications-read"),
]
