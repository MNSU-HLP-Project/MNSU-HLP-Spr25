import os
import django
import argparse

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth import get_user_model
from user_auth.models import ExtendUser  # Import your ExtendUser model

User = get_user_model()

# Parse command-line arguments
parser = argparse.ArgumentParser(description="Create a Django superuser and ExtendUser instance.")
parser.add_argument("--username", type=str, required=True, help="Username for the superuser")
parser.add_argument("--email", type=str, required=True, help="Email for the superuser")
parser.add_argument("--password", type=str, required=True, help="Password for the superuser")

args = parser.parse_args()

# Create Superuser if not exists
if not User.objects.filter(username=args.username).exists():
    user = User.objects.create_superuser(username=args.username, email=args.email, password=args.password)
    print(f"Superuser '{args.username}' created successfully.")
else:
    user = User.objects.get(username=args.username)
    print(f"Superuser '{args.username}' already exists.")

# Create ExtendUser instance if not exists
if not ExtendUser.objects.filter(user=user).exists():
    ExtendUser.objects.create(user=user, role='Superuser')
    print(f"ExtendUser instance created.")
else:
    print("ExtendUser instance already exists.")
