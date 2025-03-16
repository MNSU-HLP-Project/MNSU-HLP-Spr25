from django.urls import path
from .views import (
    RegisterView, 
    UserProfileView, 
    LoginView,
    AnnouncementListCreateView,
    AnnouncementDetailView,
    SubmissionListCreateView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),
    path('announcements/', AnnouncementListCreateView.as_view(), name='announcement-list'),
    path('announcements/<int:pk>/', AnnouncementDetailView.as_view(), name='announcement-detail'),
    path('submissions/', SubmissionListCreateView.as_view(), name='submission-list'),
]
