from django.contrib.auth.models import User
from user_auth.models import Supervisor

# Replace with the username or email from your token
user = User.objects.get(username="your_username_here")
print(Supervisor.objects.filter(user=user).exists())
