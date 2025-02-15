from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Entry
from .serializers import EntrySerializer
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view

@api_view(["GET"])
def get_entries(request):
    entries = Entry.objects.all()
    serializer = EntrySerializer(entries, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def create_entry(request):
    serializer = EntrySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)



@api_view(["DELETE"])
def delete_entry(request, id):
    entry = get_object_or_404(Entry, id=id)  # Correct function name
    entry.delete()
    return Response({"message": "Entry deleted successfully!"}, status=204)
