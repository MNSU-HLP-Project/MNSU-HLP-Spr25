from django.urls import path
from .views import create_entry

urlpatterns = [
    path('create-entry/', create_entry, name='create-entry'),
]
