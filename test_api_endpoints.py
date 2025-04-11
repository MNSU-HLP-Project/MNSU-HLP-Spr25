"""
This script tests the API endpoints for the HLP submission workflow.
It doesn't make actual HTTP requests but checks if the endpoints are correctly defined.
"""

import os
import sys
import django

# Set up Django environment
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.urls import resolve, reverse
from django.test import RequestFactory
from entries.views import (
    get_prompts, get_student_entries, get_entry_detail,
    add_teacher_comment, update_entry_status, create_entry,
    get_entries_by_supervisor_students
)

def test_url_resolution():
    """Test if URLs resolve to the correct view functions"""
    print("Testing URL resolution...\n")
    
    # Define the URLs to test
    urls_to_test = [
        ('/entries/prompts/', get_prompts),
        ('/entries/student/entries/', get_student_entries),
        ('/entries/entries/1/', get_entry_detail),
        ('/entries/entries/1/comment/', add_teacher_comment),
        ('/entries/entries/1/status/', update_entry_status),
        ('/entries/create-entry/', create_entry),
        ('/entries/supervisor/student-entries/', get_entries_by_supervisor_students),
    ]
    
    # Test each URL
    for url, expected_view in urls_to_test:
        try:
            resolved = resolve(url)
            if resolved.func == expected_view:
                print(f"✅ {url} resolves to {expected_view.__name__}")
            else:
                print(f"❌ {url} resolves to {resolved.func.__name__} instead of {expected_view.__name__}")
        except Exception as e:
            print(f"❌ {url} failed to resolve: {str(e)}")
    
    print("\n" + "-"*50 + "\n")

def test_view_functions():
    """Test if view functions accept the correct HTTP methods"""
    print("Testing view functions...\n")
    
    # Create a request factory
    factory = RequestFactory()
    
    # Define the views to test with their allowed methods
    views_to_test = [
        (get_prompts, ['GET']),
        (get_student_entries, ['GET']),
        (get_entry_detail, ['GET']),
        (add_teacher_comment, ['POST']),
        (update_entry_status, ['PATCH']),
        (create_entry, ['POST']),
        (get_entries_by_supervisor_students, ['GET']),
    ]
    
    # Test each view
    for view, allowed_methods in views_to_test:
        print(f"Testing {view.__name__}...")
        
        # Check if the view function has the correct decorator
        if hasattr(view, 'cls'):
            view_methods = [m.upper() for m in view.cls.http_method_names if m != 'options']
            for method in allowed_methods:
                if method in view_methods:
                    print(f"  ✅ Accepts {method} requests")
                else:
                    print(f"  ❌ Does not accept {method} requests")
        else:
            print(f"  ⚠️ Could not determine allowed methods")
    
    print("\n" + "-"*50 + "\n")

def test_serializers():
    """Test if serializers are correctly defined"""
    print("Testing serializers...\n")
    
    from entries.serializers import (
        EntrySerializer, EntryCreateSerializer, PromptSerializer,
        PromptResponseSerializer, EvidenceForMasterySerializer,
        TeacherCommentSerializer
    )
    
    # Define the serializers to test with their expected fields
    serializers_to_test = [
        (EntrySerializer, ['id', 'user', 'user_detail', 'hlp', 'lookfor_number', 'score', 'date', 'comments', 
                          'teacher_reply', 'status', 'week_number', 'weekly_goal', 'criteria_for_mastery', 
                          'goal_reflection', 'created_at', 'updated_at', 'prompt_responses', 'evidences', 'teacher_comments']),
        (EntryCreateSerializer, ['user', 'hlp', 'lookfor_number', 'score', 'date', 'comments', 'weekly_goal', 
                                'criteria_for_mastery', 'goal_reflection', 'week_number', 'prompt_responses', 'evidences']),
        (PromptSerializer, ['id', 'prompt', 'is_default', 'created_by', 'organization']),
        (PromptResponseSerializer, ['id', 'entry', 'prompt', 'prompt_detail', 'indicator', 'reflection', 'teacher_comments']),
        (EvidenceForMasterySerializer, ['id', 'entry', 'text', 'order']),
        (TeacherCommentSerializer, ['id', 'entry', 'supervisor', 'supervisor_name', 'comment', 'score', 'date', 'seen', 'prompt_response']),
    ]
    
    # Test each serializer
    for serializer_class, expected_fields in serializers_to_test:
        print(f"Testing {serializer_class.__name__}...")
        
        # Get the actual fields
        serializer = serializer_class()
        actual_fields = list(serializer.fields.keys())
        
        # Check if all expected fields are present
        missing_fields = [field for field in expected_fields if field not in actual_fields]
        extra_fields = [field for field in actual_fields if field not in expected_fields]
        
        if not missing_fields and not extra_fields:
            print(f"  ✅ All expected fields are present")
        else:
            if missing_fields:
                print(f"  ❌ Missing fields: {', '.join(missing_fields)}")
            if extra_fields:
                print(f"  ⚠️ Extra fields: {', '.join(extra_fields)}")
    
    print("\n" + "-"*50 + "\n")

def test_models():
    """Test if models are correctly defined"""
    print("Testing models...\n")
    
    from entries.models import (
        Entry, Prompt, PromptResponse, EvidenceForMastery, TeacherComment
    )
    
    # Define the models to test with their expected fields
    models_to_test = [
        (Entry, ['id', 'user', 'hlp', 'lookfor_number', 'score', 'date', 'comments', 'teacher_reply', 
                'status', 'week_number', 'weekly_goal', 'criteria_for_mastery', 'goal_reflection', 
                'created_at', 'updated_at']),
        (Prompt, ['id', 'prompt', 'is_default', 'created_by', 'organization']),
        (PromptResponse, ['id', 'entry', 'prompt', 'indicator', 'reflection']),
        (EvidenceForMastery, ['id', 'entry', 'text', 'order']),
        (TeacherComment, ['id', 'entry', 'supervisor', 'comment', 'score', 'date', 'seen', 'prompt_response']),
    ]
    
    # Test each model
    for model_class, expected_fields in models_to_test:
        print(f"Testing {model_class.__name__}...")
        
        # Get the actual fields
        actual_fields = [field.name for field in model_class._meta.get_fields()]
        
        # Check if all expected fields are present
        missing_fields = [field for field in expected_fields if field not in actual_fields]
        
        if not missing_fields:
            print(f"  ✅ All expected fields are present")
        else:
            print(f"  ❌ Missing fields: {', '.join(missing_fields)}")
    
    print("\n" + "-"*50 + "\n")

if __name__ == "__main__":
    print("Testing API endpoints for HLP submission workflow...\n")
    
    try:
        # Run the tests
        test_url_resolution()
        test_view_functions()
        test_serializers()
        test_models()
        
        print("All tests completed!")
    except Exception as e:
        print(f"Error running tests: {str(e)}")
