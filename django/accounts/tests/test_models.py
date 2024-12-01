import pytest
from accounts.models import User, EmailVerificationToken, PasswordResetToken
from django.utils import timezone
from datetime import timedelta

@pytest.mark.django_db
def test_user_creation():
    user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
    assert user.username == 'testuser'
    assert user.email == 'test@example.com'
    assert user.check_password('testpassword')

@pytest.mark.django_db
def test_email_verification_token_creation():
    user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
    token = EmailVerificationToken.objects.create(user=user)
    token.expires_at = timezone.now() + timedelta(hours=24)
    token.save()
    assert token.user == user
    assert token.is_valid()

@pytest.mark.django_db
def test_password_reset_token_creation():
    user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
    token = PasswordResetToken.objects.create(user=user)
    token.generate_token()
    assert token.user == user
    assert token.is_valid()
