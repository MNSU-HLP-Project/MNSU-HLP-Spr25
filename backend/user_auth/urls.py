from django.urls import path
from .views import SignupView, LoginView, generate_invitation, get_grade_levels

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('generate-invite/', generate_invitation, name='generate-invite'),
    path('register-student/', SignupView.as_view(), name='register-student'),
    path('getgrades/', get_grade_levels, name='get_grades')
]

