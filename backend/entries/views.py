from rest_framework.decorators import api_view, permission_classes, renderer_classes
from rest_framework.response import Response
from .models import Entry, Prompt, PromptResponse, EvidenceForMastery, TeacherComment
from .serializers import (EntrySerializer, EntryCreateSerializer, PromptSerializer,
                          PromptResponseSerializer, EvidenceForMasterySerializer,
                          TeacherCommentSerializer)
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.renderers import JSONRenderer
from django.db.models import Q
from django.contrib.auth.models import User
from datetime import date

@api_view(["GET"])
def get_entries(request):
    try:
        print("Fetching all entries...")
        entries = Entry.objects.all()
        serializer = EntrySerializer(entries, many=True)

        response_data = {
            "No of entries found": entries.count(),
            "entries": serializer.data
        }

        print(f"Found {entries.count()} entries")
        return Response(response_data)
    except Exception as e:
        print(f"Error in get_entries: {str(e)}")
        return Response({"error": f"Error fetching entries: {str(e)}"}, status=500)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_entry(request):
    try:
        # Add the current user to the data if not provided
        data = request.data.copy()
        if 'user' not in data:
            data['user'] = request.user.id

        # Print the data for debugging
        print(f"Received data for create_entry: {data}")

        # Ensure required fields are present
        required_fields = ['hlp', 'weekly_goal', 'criteria_for_mastery', 'prompt_responses', 'evidences']
        missing_fields = [field for field in required_fields if field not in data or not data[field]]

        if missing_fields:
            print(f"Missing required fields: {missing_fields}")
            return Response({"error": f"Missing required fields: {', '.join(missing_fields)}"}, status=400)

        serializer = EntryCreateSerializer(data=data)

        if serializer.is_valid():
            try:
                print("Serializer is valid, attempting to save...")
                entry = serializer.save()
                print(f"Entry saved successfully with ID: {entry.id}")

                # Return the full entry with all nested data
                return_serializer = EntrySerializer(entry)
                return Response(
                    {"message": "Entry has been created successfully!", "entry": return_serializer.data},
                    status=201
                )
            except Exception as e:
                print(f"Error saving entry: {str(e)}")
                return Response({"error": f"Error saving entry: {str(e)}"}, status=500)
        else:
            print(f"Validation errors: {serializer.errors}")
            return Response({"error": "Failed to create entry", "details": serializer.errors}, status=400)
    except Exception as e:
        print(f"Unexpected error in create_entry: {str(e)}")
        return Response({"error": f"Unexpected error: {str(e)}"}, status=500)




@api_view(["DELETE"])
def delete_entry(request, id):
    entry = get_object_or_404(Entry, id=id)  # Correct function name
    entry.delete()
    return Response({"message": "Entry deleted successfully!"}, status=204)


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

@api_view(["GET"])
@permission_classes([IsAuthenticated])
@renderer_classes([JSONRenderer])
def get_entries_by_supervisor_students(request):
    try:
        user = request.user
        print(f"User requesting entries: {user.username}")

        # For testing/development, if user doesn't have supervisor attribute,
        # return all entries from all users
        if not hasattr(user, 'supervisor'):
            print("User is not a supervisor, returning all entries for testing")
            student_users = User.objects.all()
        else:
            # Normal flow for supervisors
            supervisor = user.supervisor
            student_teachers = supervisor.student_teachers.all()
            student_users = [st.user for st in student_teachers]
            print(f"Found {len(student_users)} students for supervisor")
    except Exception as e:
        print(f"Error getting student users: {str(e)}")
        # Fallback to all users for testing
        student_users = User.objects.all()

    # Get filter parameters
    hlp = request.GET.get('hlp', None)
    week = request.GET.get('week', None)
    status_filter = request.GET.get('status', None)
    student_id = request.GET.get('student_id', None)

    # Start with base query
    query = Q(user__in=student_users)

    # Apply filters if provided
    if hlp:
        query &= Q(hlp=hlp)
    if week:
        query &= Q(week_number=week)
    if status_filter:
        query &= Q(status=status_filter)
    if student_id:
        query &= Q(user_id=student_id)

    entries = Entry.objects.filter(query).order_by('-created_at')
    serializer = EntrySerializer(entries, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_student_entries(request):
    """Get entries for the current student"""
    user = request.user

    # Get filter parameters
    hlp = request.GET.get('hlp', None)
    week = request.GET.get('week', None)
    status_filter = request.GET.get('status', None)

    # Start with base query
    query = Q(user=user)

    # Apply filters if provided
    if hlp:
        query &= Q(hlp=hlp)
    if week:
        query &= Q(week_number=week)
    if status_filter:
        query &= Q(status=status_filter)

    entries = Entry.objects.filter(query).order_by('-created_at')
    serializer = EntrySerializer(entries, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_entry_detail(request, entry_id):
    """Get detailed information about a specific entry"""
    user = request.user

    # Get the entry
    entry = get_object_or_404(Entry, id=entry_id)

    # For development/testing, allow any user to view any entry
    print(f"User {user.username} requesting entry {entry_id}")

    # In production, uncomment this code to enforce permissions
    # is_owner = entry.user == user
    # is_supervisor = hasattr(user, 'supervisor') and entry.user in [st.user for st in user.supervisor.student_teachers.all()]
    # if not (is_owner or is_supervisor):
    #     return Response({'error': 'You do not have permission to view this entry.'},
    #                     status=status.HTTP_403_FORBIDDEN)

    serializer = EntrySerializer(entry)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_teacher_comment(request, entry_id):
    """Add a teacher comment to an entry"""
    user = request.user

    try:
        # Get the entry
        entry = get_object_or_404(Entry, id=entry_id)

        # For development/testing, allow any user to comment
        if not hasattr(user, 'supervisor'):
            print(f"User {user.username} is not a supervisor but will be allowed to comment for testing")
            # Create a dummy supervisor ID for testing
            supervisor_id = 1
            # Skip student check for testing
            student_check_passed = True
        else:
            # Normal flow for supervisors
            supervisor_id = user.supervisor.id
            # Check if this supervisor can comment on this entry
            student_users = [st.user for st in user.supervisor.student_teachers.all()]
            student_check_passed = entry.user in student_users

            if not student_check_passed:
                return Response({'error': 'You cannot comment on entries from students not assigned to you.'},
                            status=status.HTTP_403_FORBIDDEN)
    except Exception as e:
        print(f"Error in permission check: {str(e)}")
        # For development, allow the operation to continue
        supervisor_id = 1
        student_check_passed = True

    # Create the comment
    data = request.data.copy()
    data['entry'] = entry_id
    data['supervisor'] = supervisor_id  # Use the supervisor_id we determined earlier
    data['date'] = date.today()

    # Check if this is for a specific prompt response
    prompt_response_id = data.get('prompt_response', None)
    if prompt_response_id:
        # Verify the prompt response belongs to this entry
        prompt_response = get_object_or_404(PromptResponse, id=prompt_response_id, entry=entry)
        data['prompt_response'] = prompt_response.id

    serializer = TeacherCommentSerializer(data=data)
    if serializer.is_valid():
        comment = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_entry_status(request, entry_id):
    """Update the status of an entry (approve or request revision)"""
    user = request.user

    try:
        # Get the entry
        entry = get_object_or_404(Entry, id=entry_id)

        # For development/testing, allow any user to update status
        if not hasattr(user, 'supervisor'):
            print(f"User {user.username} is not a supervisor but will be allowed to update status for testing")
            # Skip student check for testing
            student_check_passed = True
        else:
            # Normal flow for supervisors
            # Check if this supervisor can update this entry
            student_users = [st.user for st in user.supervisor.student_teachers.all()]
            student_check_passed = entry.user in student_users

            if not student_check_passed:
                return Response({'error': 'You cannot update entries from students not assigned to you.'},
                            status=status.HTTP_403_FORBIDDEN)

        # Update the status
        new_status = request.data.get('status', None)
        if not new_status or new_status not in [s[0] for s in Entry.STATUS_CHOICES]:
            return Response({'error': 'Invalid status value.'}, status=status.HTTP_400_BAD_REQUEST)

        entry.status = new_status
        entry.save()

        return Response({'message': f'Entry status updated to {new_status}.'}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error updating entry status: {str(e)}")
        return Response({'error': f'Error updating entry status: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_prompts(request):
    """Get all prompts available to the user"""
    user = request.user

    try:
        # Get the user's organization
        if hasattr(user, 'extend_user') and user.extend_user.org:
            # Get prompts from the user's organization
            org = user.extend_user.org
            prompts = org.get_all_prompts()
        else:
            # If user has no organization, get all prompts
            prompts = Prompt.objects.all()

        serializer = PromptSerializer(prompts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error in get_prompts: {str(e)}")
        # Return empty list instead of error
        return Response([], status=status.HTTP_200_OK)