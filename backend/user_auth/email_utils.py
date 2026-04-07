from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .models import EmailOTP
import logging
import json
import requests

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
            subject = 'Your HLP account verification code'
            context = {
                'user_name': user_name or 'User',
                'otp_code': otp_code,
                'email_type': 'signup'
            }
        elif otp_type == 'password_reset':
            subject = 'Your HLP password reset code'
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

        # Send via SendGrid Web API (HTTP). SMTP is blocked on Render.
        if not getattr(settings, 'SENDGRID_API_KEY', None):
            raise ValueError("SENDGRID_API_KEY is not configured in environment")

        api_url = 'https://api.sendgrid.com/v3/mail/send'
        headers = {
            'Authorization': f"Bearer {settings.SENDGRID_API_KEY}",
            'Content-Type': 'application/json',
        }
        from_email = settings.DEFAULT_FROM_EMAIL
        
        # Parse from_email - handle both "Name <email@domain.com>" and "email@domain.com" formats
        if '<' in from_email:
            # Format: "Name <email@domain.com>"
            email_address = from_email.split('<')[-1].rstrip('>')
            email_name = from_email.split('<')[0].strip()
        else:
            # Format: "email@domain.com" - use email as address and default name
            email_address = from_email
            email_name = "HLP Tracker"  # Default name for plain email addresses

        # Build SendGrid payload with proper headers for better deliverability
        data = {
            "personalizations": [
                {
                    "to": [{"email": email}],
                    "subject": subject,
                }
            ],
            "from": {
                "email": email_address,
                "name": email_name
            },
            "reply_to": {
                "email": email_address,  # Use same domain for reply-to
                "name": email_name
            },
            "content": [
                {"type": "text/plain", "value": plain_message},
                {"type": "text/html", "value": html_message},
            ],
            "categories": ["otp", "transactional"],  # Help SendGrid categorize emails
            "custom_args": {
                "email_type": otp_type,
                "source": "hlp_tracker"
            },
            # Add headers for better deliverability and spam prevention
            # Outlook/Hotmail requires specific headers for better deliverability
            "headers": {
                "X-Mailer": "HLP Tracker",
                "X-Entity-Ref-ID": f"hlp-{otp_type}",
                "List-Unsubscribe": f"<mailto:no-reply@myhlptracker.com?subject=unsubscribe>",
                "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
                "X-Auto-Response-Suppress": "All",  # Prevents Outlook auto-replies
                "Auto-Submitted": "auto-generated",  # Marks as transactional email
            },
            # Mail settings for transactional emails (prevents spam filtering)
            "mail_settings": {
                "bypass_list_management": {
                    "enable": False
                },
                "footer": {
                    "enable": False
                },
                "sandbox_mode": {
                    "enable": False
                }
            },
            # Tracking settings - disable for transactional emails (better deliverability)
            "tracking_settings": {
                "click_tracking": {
                    "enable": False
                },
                "open_tracking": {
                    "enable": False
                },
                "subscription_tracking": {
                    "enable": False
                }
            }
        }

        response = requests.post(api_url, headers=headers, data=json.dumps(data), timeout=10)
        if response.status_code not in (200, 202):
            logger.error(f"SendGrid API error ({response.status_code}): {response.text}")
            raise RuntimeError("Failed to send email via SendGrid")

        logger.info(f"OTP email sent successfully to {email} for {otp_type}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send OTP email to {email}: {str(e)}")
        return False

def send_notification_email(to_email, subject, html_message):
    """
    Send a general notification email via SendGrid.

    Args:
        to_email (str): Recipient email address
        subject (str): Email subject
        html_message (str): HTML body content

    Returns:
        bool: True if sent successfully, False otherwise
    """
    try:
        if not getattr(settings, 'SENDGRID_API_KEY', None):
            raise ValueError("SENDGRID_API_KEY is not configured in environment")

        plain_message = strip_tags(html_message)
        from_email = settings.DEFAULT_FROM_EMAIL

        if '<' in from_email:
            email_address = from_email.split('<')[-1].rstrip('>')
            email_name = from_email.split('<')[0].strip()
        else:
            email_address = from_email
            email_name = "HLP Tracker"

        data = {
            "personalizations": [{"to": [{"email": to_email}], "subject": subject}],
            "from": {"email": email_address, "name": email_name},
            "reply_to": {"email": email_address, "name": email_name},
            "content": [
                {"type": "text/plain", "value": plain_message},
                {"type": "text/html", "value": html_message},
            ],
            "tracking_settings": {
                "click_tracking": {"enable": False},
                "open_tracking": {"enable": False},
            },
        }

        response = requests.post(
            'https://api.sendgrid.com/v3/mail/send',
            headers={
                'Authorization': f"Bearer {settings.SENDGRID_API_KEY}",
                'Content-Type': 'application/json',
            },
            data=json.dumps(data),
            timeout=10,
        )

        if response.status_code not in (200, 202):
            logger.error(f"SendGrid API error ({response.status_code}): {response.text}")
            return False

        logger.info(f"Notification email sent to {to_email}: {subject}")
        return True

    except Exception as e:
        logger.error(f"Failed to send notification email to {to_email}: {str(e)}")
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

