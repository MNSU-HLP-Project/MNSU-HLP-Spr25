#!/usr/bin/env python
"""
Test script for password reset functionality
"""
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from user_auth.models import EmailOTP
from user_auth.email_utils import create_and_send_otp, verify_otp

def test_password_reset():
    print("🧪 Testing Password Reset Flow")
    print("=" * 50)
    
    # Check if there are any users in the database
    users = User.objects.all()
    print(f"📊 Total users in database: {users.count()}")
    
    if users.exists():
        # Get the first user
        user = users.first()
        print(f"👤 Testing with user: {user.email}")
        print(f"   - Username: {user.username}")
        print(f"   - Is Active: {user.is_active}")
        
        # Test creating and sending OTP
        print("\n📧 Testing OTP creation and sending...")
        try:
            otp = create_and_send_otp(user.email, 'password_reset', user)
            if otp:
                print(f"✅ OTP created successfully!")
                print(f"   - OTP Code: {otp.otp_code}")
                print(f"   - Email: {otp.email}")
                print(f"   - Type: {otp.otp_type}")
                print(f"   - Expires: {otp.expires_at}")
                print(f"   - Is Valid: {otp.is_valid()}")
                
                # Test verifying OTP
                print(f"\n🔍 Testing OTP verification...")
                success, message, otp_obj = verify_otp(user.email, otp.otp_code, 'password_reset')
                print(f"   - Success: {success}")
                print(f"   - Message: {message}")
                
            else:
                print("❌ Failed to create OTP")
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            
    else:
        print("❌ No users found in database!")
        print("   Create a user first by registering through the app.")
    
    # Check existing OTPs
    print(f"\n📋 Existing OTPs in database:")
    otps = EmailOTP.objects.all().order_by('-created_at')[:5]
    for otp in otps:
        print(f"   - {otp.email} | {otp.otp_type} | {otp.otp_code} | Used: {otp.is_used} | Valid: {otp.is_valid()}")

if __name__ == "__main__":
    test_password_reset()

