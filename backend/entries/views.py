from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Entry
from .serializers import EntrySerializer
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view

@api_view(["GET"])
def get_entries(request):
    entries = Entry.objects.all()
    serializer = EntrySerializer(entries, many=True)

    response_data = {
        "No of entries found": entries.count(),
        "entries": serializer.data
    }
    
    return Response(response_data)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import EntrySerializer
from .models import Entry

@api_view(["POST"])
def create_entry(request):
    serializer = EntrySerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
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