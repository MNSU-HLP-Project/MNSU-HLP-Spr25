from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Submission, Announcement
from .serializers import SubmissionSerializer, AnnouncementSerializer
from django.core.exceptions import ValidationError

class SubmissionViewSet(viewsets.ModelViewSet):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Students can only see their own submissions
        if not self.request.user.extenduser.role == 'teacher':
            return Submission.objects.filter(student=self.request.user)
        # Teachers can see all submissions
        return Submission.objects.all()

    def perform_create(self, serializer):
        try:
            serializer.save(student=self.request.user)
        except ValidationError as e:
            raise ValidationError(detail=str(e))

    def destroy(self, request, *args, **kwargs):
        submission = self.get_object()
        # Only allow deletion if status is pending
        if submission.status != 'pending':
            return Response(
                {"detail": "Cannot delete reviewed submissions"},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)
class AnnouncementViewSet(viewsets.ModelViewSet):
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Announcement.objects.all()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def destroy(self, request, *args, **kwargs):
        announcement = self.get_object()
        # Only allow authors or teachers to delete announcements
        if announcement.author != request.user and not request.user.extend_user.role == 'teacher':
            return Response(
                {"detail": "You do not have permission to delete this announcement"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)
