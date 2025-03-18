from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import SubmissionViewSet, AnnouncementViewSet
from .views import UserProfileView, LoginView, RegisterView

router = DefaultRouter()
router.register(r'submissions', SubmissionViewSet, basename='submission')
router.register(r'announcements', AnnouncementViewSet, basename='announcement')

urlpatterns = [
    path('', include(router.urls)),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
]
