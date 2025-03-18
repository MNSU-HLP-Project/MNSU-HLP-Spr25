from django.urls import path
from .views import SignupView, LoginView, generate_invitation, get_grade_levels, generate_class, get_class_names

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('generate-invite/', generate_invitation, name='generate-invite'),
    path('register-student/', SignupView.as_view(), name='register-student'),
    path('getgrades/', get_grade_levels, name='get_grades'),
    path('generate-class/', generate_class, name='generate-class'),
    path('get-classes/', get_class_names, name='get-classes')
]

