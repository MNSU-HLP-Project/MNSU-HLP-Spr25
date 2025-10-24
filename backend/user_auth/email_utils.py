from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .models import EmailOTP
import logging

logger = logging.getLogger(__name__)

def send_otp_email(email, otp_code, otp_type, user_name=None):
    """
    Send OTP email to user
    
    Args:
        email (str): User's email address
        otp_code (str): The OTP code to send
        otp_type (str): Type of OTP (signup or password_reset)
        user_name (str): User's name for personalization
    """
    try:
        if otp_type == 'signup':
            subject = 'Verify Your Email - HLP Account'
            context = {
                'user_name': user_name or 'User',
                'otp_code': otp_code,
                'email_type': 'signup'
            }
        elif otp_type == 'password_reset':
            subject = 'Password Reset Code - HLP Account'
            context = {
                'user_name': user_name or 'User',
                'otp_code': otp_code,
                'email_type': 'password_reset'
            }
        else:
            raise ValueError(f"Invalid OTP type: {otp_type}")
        
        # Create HTML email content
        html_message = render_to_string('email_otp.html', context)
        plain_message = strip_tags(html_message)
        
        # Send email
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            html_message=html_message,
            fail_silently=False,
        )
        
        logger.info(f"OTP email sent successfully to {email} for {otp_type}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send OTP email to {email}: {str(e)}")
        return False

def create_and_send_otp(email, otp_type, user=None):
    """
    Create an OTP record and send it via email
    
    Args:
        email (str): User's email address
        otp_type (str): Type of OTP (signup or password_reset)
        user (User): User object (optional, for password reset)
    
    Returns:
        EmailOTP: The created OTP object or None if failed
    """
    try:
        # Invalidate any existing OTPs for this email and type
        EmailOTP.objects.filter(
            email=email, 
            otp_type=otp_type, 
            is_used=False
        ).update(is_used=True)
        
        # Create new OTP
        otp = EmailOTP.objects.create(
            email=email,
            otp_type=otp_type,
            user=user
        )
        
        # Send email
        user_name = user.get_full_name() if user else None
        if send_otp_email(email, otp.otp_code, otp_type, user_name):
            return otp
        else:
            otp.delete()
            return None
            
    except Exception as e:
        logger.error(f"Failed to create and send OTP for {email}: {str(e)}")
        return None

def verify_otp(email, otp_code, otp_type):
    """
    Verify an OTP code
    
    Args:
        email (str): User's email address
        otp_code (str): The OTP code to verify
        otp_type (str): Type of OTP (signup or password_reset)
    
    Returns:
        tuple: (success: bool, message: str, otp_object: EmailOTP or None)
    """
    try:
        # Find the most recent valid OTP
        otp = EmailOTP.objects.filter(
            email=email,
            otp_type=otp_type,
            is_used=False
        ).first()
        
        if not otp:
            return False, "No OTP found for this email", None
        
        if otp.is_expired():
            return False, "OTP has expired. Please request a new one.", None
        
        if otp.otp_code != otp_code:
            return False, "Invalid OTP code", None
        
        # Mark OTP as used (consuming verification)
        otp.is_used = True
        otp.save()
        
        return True, "OTP verified successfully", otp
        
    except Exception as e:
        logger.error(f"Failed to verify OTP for {email}: {str(e)}")
        return False, "An error occurred during verification", None

def check_otp(email, otp_code, otp_type):
    """
    Non-consuming OTP check. Validates OTP without marking it as used.
    Returns tuple: (success: bool, message: str, otp_object: EmailOTP or None)
    """
    try:
        otp = EmailOTP.objects.filter(
            email=email,
            otp_type=otp_type,
            is_used=False
        ).first()
        
        if not otp:
            return False, "No OTP found for this email", None
        
        if otp.is_expired():
            return False, "OTP has expired. Please request a new one.", None
        
        if otp.otp_code != otp_code:
            return False, "Invalid OTP code", None
        
        return True, "OTP verified successfully", otp
        
    except Exception as e:
        logger.error(f"Failed to check OTP for {email}: {str(e)}")
        return False, "An error occurred during verification", None

