from django.urls import path
from .views import SignupView, LoginView
from .views import get_extend_users, get_organizations, get_student_teachers, get_supervisors, get_grade_levels
urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('extend-users/', get_extend_users, name='extend-users'),
    path('organizations/', get_organizations, name='organizations'),
    path('student-teachers/', get_student_teachers, name='student-teachers'),
    path('supervisors/', get_supervisors, name='supervisors'),
    path('grade-levels/', get_grade_levels, name='grade-levels'),
]
