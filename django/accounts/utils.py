from django.db import connection
from django.db.utils import ProgrammingError
from django.apps import apps
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def send_verification_email(user, verification_token):
    verification_link = f"{settings.FRONTEND_URL}/verify-email/{verification_token}"
    render_and_send_mail(user, 'emails/verification.html', verification_link)

def send_password_reset_email(user, reset_token):
    reset_link = f"{settings.FRONTEND_URL}/reset-password/{reset_token}"
    render_and_send_mail(user, 'emails/password_reset.html', reset_link)

def render_and_send_mail(user, template, link):
    html_message = render_to_string(template, {
        'username': user.username,
        'link': link,
        'platform_name': 'Learn English Platform'
    })
    plain_message = strip_tags(html_message)
    send_mail(
        'Important - Learn English Platform',
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        html_message=html_message,
        fail_silently=False,
    )
