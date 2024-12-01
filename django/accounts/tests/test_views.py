import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.test import APIClient
from accounts.models import User, EmailVerificationToken, PasswordResetToken, ProfilePicture
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone
from datetime import timedelta

@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
def test_user_registration(api_client):
    url = reverse('register')
    data = {
        'username': 'newuser',
        'email': 'newuser@example.com',
        'password': 'ComplexPassword123!',
        'password_confirmation': 'ComplexPassword123!'
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_201_CREATED

@pytest.mark.django_db
def test_user_login(api_client):
    user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
    url = reverse('token_obtain_pair')
    data = {
        'email': 'test@example.com',
        'password': 'testpassword'
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_200_OK
    assert 'access' in response.data

@pytest.mark.django_db
def test_email_verification(api_client):
    user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
    token = EmailVerificationToken.objects.create(user=user)
    token.expires_at = timezone.now() + timedelta(hours=24)
    token.save()

    url = reverse('email_verification')
    data = {
        'token': str(token.token)
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_password_reset_request(api_client):
    user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
    url = reverse('password_reset_request')
    data = {
        'email': 'test@example.com'
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_password_reset_confirm(api_client):
    user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
    token = PasswordResetToken.objects.create(user=user)
    token.generate_token()

    url = reverse('password_reset_confirm')
    data = {
        'token': token.token,
        'new_password': 'newPassword123!',
        'confirm_password': 'newPassword123!'
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_upload_profile_picture(api_client):
    user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
    api_client.force_authenticate(user=user)

    url = reverse('upload_profile_picture')
    image = SimpleUploadedFile("test_image.jpg", b"file_content", content_type="image/jpeg")
    response = api_client.post(url, {'profile_picture': image}, format='multipart')
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_delete_profile_picture(api_client):
    user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
    image = SimpleUploadedFile("test_image.jpg", b"file_content", content_type="image/jpeg")
    profile_picture = ProfilePicture.objects.create(user=user, image=image)
    api_client.force_authenticate(user=user)

    url = reverse('delete_profile_picture')
    response = api_client.delete(url)
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_reset_progress(api_client):
    user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
    api_client.force_authenticate(user=user)

    url = reverse('reset_progress')
    response = api_client.post(url, format='json')
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_note_crud(api_client):
    user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
    api_client.force_authenticate(user=user)

    url = reverse('note-list')
    data = {
        'title': 'Test Note',
        'content': 'This is a test note'
    }
    # Create
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_201_CREATED
    note_id = response.data['id']

    # Read
    response = api_client.get(url, format='json')
    assert response.status_code == status.HTTP_200_OK

    # Update
    update_url = reverse('note-detail', args=[note_id])
    update_data = {
        'title': 'Updated Note',
        'content': 'This is an updated note'
    }
    response = api_client.put(update_url, update_data, format='json')
    assert response.status_code == status.HTTP_200_OK

    # Delete
    response = api_client.delete(update_url, format='json')
    assert response.status_code == status.HTTP_204_NO_CONTENT

@pytest.mark.django_db
def test_recommended_lessons(api_client):
    user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
    api_client.force_authenticate(user=user)

    url = reverse('recommended_lessons')
    response = api_client.get(url, format='json')
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_profile_view(api_client):
    user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
    api_client.force_authenticate(user=user)

    url = reverse('user_profile')
    response = api_client.get(url, format='json')
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_user_statistics(api_client):
    user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
    api_client.force_authenticate(user=user)

    url = reverse('user_statistics')
    response = api_client.get(url, format='json')
    assert response.status_code == status.HTTP_200_OK
