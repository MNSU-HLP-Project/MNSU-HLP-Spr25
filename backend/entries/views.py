from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
import jwt
from django.conf import settings
from .models import Entry, TeacherComment, Notification
from .serializers import EntrySerializer, TeacherCommentSerializer, NotificationSerializer

@api_view(["GET"])
def get_entries(request):
    entries = Entry.objects.all()
    serializer = EntrySerializer(entries, many=True)

    response_data = {
        "No of entries found": entries.count(),
        "entries": serializer.data
    }

    return Response(response_data)

@api_view(["POST"])
def get_user_entries(request):
    # Extract token from request
    token = request.data.get('token', None)
    user = None

    # Attempt to get user from token
    if token:
        try:
            # Decode the JWT token
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')

            # Get the user
            if user_id:
                user = User.objects.get(id=user_id)
        except (jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist):
            return Response({"error": "Invalid token or user not found"}, status=401)
    else:
        return Response({"error": "Authentication token required"}, status=401)

    # Get entries for the authenticated user
    entries = Entry.objects.filter(user=user).order_by('-date')
    serializer = EntrySerializer(entries, many=True)

    response_data = {
        "count": entries.count(),
        "entries": serializer.data
    }

    return Response(response_data)

# Imports already at the top of the file

@api_view(["POST"])
def create_entry(request):
    # Extract token if provided for user authentication
    token = request.data.get('token', None)
    user = None

    # Create a copy of the data without the token
    entry_data = request.data.copy()
    if 'token' in entry_data:
        del entry_data['token']

    # Attempt to get user from token
    if token:
        try:
            # Decode the JWT token
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')

            # Get the user
            if user_id:
                user = User.objects.get(id=user_id)
        except (jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist):
            # If token is invalid or user doesn't exist, continue without user
            pass

    # Create serializer with the cleaned data
    serializer = EntrySerializer(data=entry_data)

    if serializer.is_valid():
        # Save the entry
        entry = serializer.save()

        # Associate with user if authenticated
        if user:
            entry.user = user
            entry.save()

            # Update the serializer data to include user info
            serializer = EntrySerializer(entry)

        return Response(
            {"message": "Entry has been created successfully!", "entry": serializer.data},
            status=201
        )

    return Response({"error": "Failed to create entry", "details": serializer.errors}, status=400)




@api_view(["DELETE"])
def delete_entry(request, id):
    entry = get_object_or_404(Entry, id=id)  # Correct function name
    entry.delete()
    return Response({"message": "Entry deleted successfully!"}, status=204)

@api_view(["POST"])
def get_entry_comments(request, entry_id):
    # Extract token from request
    token = request.data.get('token', None)
    user = None

    # Attempt to get user from token
    if token:
        try:
            # Decode the JWT token
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')

            # Get the user
            if user_id:
                user = User.objects.get(id=user_id)
        except (jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist):
            return Response({"error": "Invalid token or user not found"}, status=401)
    else:
        return Response({"error": "Authentication token required"}, status=401)

    # Get the entry
    try:
        entry = Entry.objects.get(id=entry_id)

        # Check if the user is the owner of the entry or a teacher/supervisor
        # For now, we'll allow any authenticated user to view comments
        # In a real app, you'd check user roles here

        # Get comments for the entry
        from .serializers import TeacherCommentSerializer
        comments = entry.teacher_comments.all().order_by('-date')
        serializer = TeacherCommentSerializer(comments, many=True)

        return Response({
            "entry_id": entry_id,
            "comments": serializer.data
        })
    except Entry.DoesNotExist:
        return Response({"error": "Entry not found"}, status=404)

@api_view(["POST"])
def add_comment(request, entry_id):
    # Extract token from request
    token = request.data.get('token', None)
    user = None

    # Attempt to get user from token
    if token:
        try:
            # Decode the JWT token
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')

            # Get the user
            if user_id:
                user = User.objects.get(id=user_id)
        except (jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist):
            return Response({"error": "Invalid token or user not found"}, status=401)
    else:
        return Response({"error": "Authentication token required"}, status=401)

    # Get the entry
    try:
        entry = Entry.objects.get(id=entry_id)

        # Check if the user is a teacher/supervisor
        # In a real app, you'd check user roles here
        # For now, we'll allow any authenticated user to add comments

        # Create the comment
        from .serializers import TeacherCommentSerializer

        comment_data = {
            'entry': entry.id,
            'teacher': user.id,
            'comment': request.data.get('comment', ''),
            'score': request.data.get('score', 5),
        }

        serializer = TeacherCommentSerializer(data=comment_data)

        if serializer.is_valid():
            comment = serializer.save()

            # Mark the entry as having a teacher reply
            entry.teacher_reply = True
            entry.save()

            # Create notification for the entry owner
            if entry.user:
                notification = Notification.objects.create(
                    user=entry.user,
                    notification_type=Notification.COMMENT,
                    title="New Comment on Your Entry",
                    message=f"A teacher has commented on your entry about HLP {entry.hlp}.",
                    entry=entry,
                    comment=comment
                )

            return Response({
                "message": "Comment added successfully",
                "comment": serializer.data
            }, status=201)
        else:
            return Response({"error": "Invalid comment data", "details": serializer.errors}, status=400)

    except Entry.DoesNotExist:
        return Response({"error": "Entry not found"}, status=404)

@api_view(["POST"])
def get_notifications(request):
    # Extract token from request
    token = request.data.get('token', None)
    user = None

    # Attempt to get user from token
    if token:
        try:
            # Decode the JWT token
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')

            # Get the user
            if user_id:
                user = User.objects.get(id=user_id)
        except (jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist):
            return Response({"error": "Invalid token or user not found"}, status=401)
    else:
        return Response({"error": "Authentication token required"}, status=401)

    # Get notifications for the user
    notifications = Notification.objects.filter(user=user).order_by('-created_at')
    serializer = NotificationSerializer(notifications, many=True)

    return Response({
        "count": notifications.count(),
        "unread_count": notifications.filter(read=False).count(),
        "notifications": serializer.data
    })

@api_view(["POST"])
def mark_notification_read(request, notification_id):
    # Extract token from request
    token = request.data.get('token', None)
    user = None

    # Attempt to get user from token
    if token:
        try:
            # Decode the JWT token
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')

            # Get the user
            if user_id:
                user = User.objects.get(id=user_id)
        except (jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist):
            return Response({"error": "Invalid token or user not found"}, status=401)
    else:
        return Response({"error": "Authentication token required"}, status=401)

    # Get the notification
    try:
        notification = Notification.objects.get(id=notification_id, user=user)
        notification.read = True
        notification.save()

        return Response({"message": "Notification marked as read"})
    except Notification.DoesNotExist:
        return Response({"error": "Notification not found"}, status=404)

@api_view(["POST"])
def mark_all_notifications_read(request):
    # Extract token from request
    token = request.data.get('token', None)
    user = None

    # Attempt to get user from token
    if token:
        try:
            # Decode the JWT token
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')

            # Get the user
            if user_id:
                user = User.objects.get(id=user_id)
        except (jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist):
            return Response({"error": "Invalid token or user not found"}, status=401)
    else:
        return Response({"error": "Authentication token required"}, status=401)

    # Mark all notifications as read
    Notification.objects.filter(user=user, read=False).update(read=True)

    return Response({"message": "All notifications marked as read"})


@api_view(["GET"])
def get_entries_by_date(request):
    """Retrieve entries based on date"""
    date = request.GET.get("date", "").strip()  # Get date from query parameters

    if not date:
        return Response({"error": "Date parameter is required"}, status=400)

    try:
        # Ensure the date is in a valid format (YYYY-MM-DD)
        from datetime import datetime
        datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)

    # Filter entries by date
    entries = Entry.objects.filter(date=date)

    if not entries.exists():
        return Response({"error": f"No entries found for date '{date}'"}, status=404)

    serializer = EntrySerializer(entries, many=True)
    return Response(serializer.data, status=200)

@api_view(["GET"])
def get_entries_by_hlp(request):
    """Retrieve entries based on hlp"""
    hlp = request.GET.get("hlp", "").strip()  # Get hlp from query parameters

    if not hlp:
        return Response({"error": "hlp parameter is required"}, status=400)

    try:
        hlp = int(hlp)  # Convert hlp to integer
    except ValueError:
        return Response({"error": "hlp must be an integer"}, status=400)

    # Filter entries by hlp
    entries = Entry.objects.filter(hlp=hlp)

    if not entries.exists():
        return Response({"error": f"No entries found for hlp '{hlp}'"}, status=404)

    serializer = EntrySerializer(entries, many=True)

    response_data = {
        "record_found" : entries.count(),
        "entries": serializer.data
    }

    return Response(response_data, status=200)


@api_view(["GET"])
def get_entries_by_lookfor_number(request):
    """Retrieve entries based on lookfor_number"""
    lookfor_number = request.GET.get("lookfor_number", "").strip()  # Get hlp from query parameters

    if not lookfor_number:
        return Response({"error": "lookfor_number parameter is required"}, status=400)

    try:
        lookfor_number= int(lookfor_number)  # Convert to integer
    except ValueError:
        return Response({"error": "lookfor_number must be an integer"}, status=400)

    # Filter entries by lookfor_number
    entries = Entry.objects.filter(lookfor_number= lookfor_number)

    if not entries.exists():
        return Response({"error": f"No entries found for lookfor_number '{lookfor_number}'"}, status=404)

    serializer = EntrySerializer(entries, many=True)

    response_data = {
        "record_found" : entries.count(),
        "entries": serializer.data
    }

    return Response(response_data, status=200)