# accounts/tasks.py

from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings

@shared_task
def send_password_reset_email(email, reset_url):
    subject = 'Password Reset'
    message = f'Please click the link to reset your password: {reset_url}'
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]
    send_mail(subject, message, from_email, recipient_list)
