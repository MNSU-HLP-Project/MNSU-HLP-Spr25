from django.urls import path
from .views import (
    SignupView, LoginView, generate_invitation, generate_class, get_class_names,
    get_extend_users, get_students_in_class, edit_org, get_org_details,
    get_organizations, generate_org, get_student_teachers, get_supervisors, get_users_by_role,
    get_prompts_student, get_class_details, edit_class, delete_class,
    get_classes_by_loggedin_supervisor, get_students_under_supervisor
)

urlpatterns = [
    # Authentication URLS
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('generate-invite/', generate_invitation, name='generate-invite'),
    
    # Models Endpoitns
    path('extend-users/', get_extend_users, name='extend-users'),
    path('organizations/', get_organizations, name='organizations'),
    path('student-teachers/', get_student_teachers, name='student-teachers'),
    path('supervisors/', get_supervisors, name='supervisors'),
    
    # Class APIs
    path('generate-class/', generate_class, name='generate-class'),
    path('get-classes/', get_class_names, name='get-classes'),
    path('students-in-class/', get_students_in_class),
    path('remove-class/', delete_class, name='delete-class'),
    path('get-class-details', get_class_details, name='class-details'),
    path('edit-class/', edit_class, name='edit-class'),
    
    # Org APIS
    path('generate-org/', generate_org, name='generate-org'),
    path('get-org-details/', get_org_details, name='get-org-details'),
    path('edit_org/', edit_org, name='edit_org'),
    
    # Students and Classes
    path('my-classes/', get_classes_by_loggedin_supervisor, name='get_classes_supervisor'),
    path('my-students/', get_students_under_supervisor),
    path('get-prompts-student/', get_prompts_student)
]


