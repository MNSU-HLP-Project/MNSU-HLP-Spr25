from django.urls import path
from .views import SignupView, LoginView, generate_invitation, get_grade_levels, generate_class, get_class_names

from .views import SignupView, LoginView
from .views import get_extend_users, get_organizations, generate_org, get_student_teachers, get_supervisors, get_grade_levels, get_users_by_role, create_student_teacher, create_grade_levels, create_supervisor, get_classes_by_loggedin_supervisor
urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('generate-invite/', generate_invitation, name='generate-invite'),
    path('register-student/', SignupView.as_view(), name='register-student'),
    path('extend-users/', get_extend_users, name='extend-users'),
    path('organizations/', get_organizations, name='organizations'),
    path('student-teachers/', get_student_teachers, name='student-teachers'),
    path('supervisors/', get_supervisors, name='supervisors'),
    path('grade-levels/', get_grade_levels, name='grade-levels'),
    path('role-byname/', get_users_by_role, name= "user_names_by_role"),
    path('create_studentteacher/', create_student_teacher, name= "create_student_teacher"),
    path('create_supervisor/', create_supervisor, name= "create_supervisor"),
    path('create_gradelevel/', create_grade_levels ,name= "create_grade-level"),
    path('getgrades/', get_grade_levels, name='get_grades'),
    path('generate-class/', generate_class, name='generate-class'),
    path('get-classes/', get_class_names, name='get-classes'),
    path('generate-org/', generate_org, name='generate-org'),
    path('my-classes/', get_classes_by_loggedin_supervisor, name ='get_classes_supervisor')
]

