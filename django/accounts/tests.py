import pytest
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import User, ProfilePicture, Note
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

@pytest.mark.django_db
class TestUserAuthentication:
    def setup_method(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.login_url = reverse('token_obtain_pair')

    def test_user_registration(self):
        # Test successful registration
        registration_data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'StrongPass123!',
            'password_confirmation': 'StrongPass123!'
        }
        response = self.client.post(self.register_url, registration_data)
        assert response.status_code == status.HTTP_201_CREATED
        
        # Verify the response contains user data
        assert 'username' in response.data
        assert 'email' in response.data
        assert response.data['username'] == 'testuser'
        assert response.data['email'] == 'testuser@example.com'

    def test_user_login(self):
        # Create a user first
        user = User.objects.create_user(
            username='loginuser', 
            email='loginuser@example.com', 
            password='StrongPass123!',
            level=1
        )

        # Test successful login
        login_data = {
            'email': 'loginuser@example.com',
            'password': 'StrongPass123!'
        }
        response = self.client.post(self.login_url, login_data)
        assert response.status_code == status.HTTP_200_OK
        
        # Verify token generation
        assert 'access' in response.data
        assert 'refresh' in response.data

@pytest.mark.django_db
class TestUserProfile:
    def setup_method(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='profileuser', 
            email='profileuser@example.com', 
            password='StrongPass123!',
            level=1
        )
        # Manually create a token for authentication
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

    def test_upload_profile_picture(self):
        from django.core.files.uploadedfile import SimpleUploadedFile
        
        image = SimpleUploadedFile(
            name='test_image.jpg', 
            content=b'', 
            content_type='image/jpeg'
        )
        response = self.client.post(
            reverse('upload_profile_picture'), 
            {'profile_picture': image}, 
            format='multipart'
        )
        assert response.status_code == status.HTTP_200_OK
        assert ProfilePicture.objects.filter(user=self.user).exists()

@pytest.mark.django_db
class TestNotes:
    def setup_method(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='noteuser', 
            email='noteuser@example.com', 
            password='StrongPass123!',
            level=1
        )
        # Manually create a token for authentication
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

    def test_create_note(self):
        note_data = {
            'title': 'Test Note',
            'content': 'This is a test note content',
            'note_type': 'general'
        }
        response = self.client.post(reverse('note-list'), note_data)
        assert response.status_code == status.HTTP_201_CREATED
        assert Note.objects.filter(user=self.user).exists()
        
        # Verify note details
        note = Note.objects.get(user=self.user)
        assert note.title == 'Test Note'
        assert note.content == 'This is a test note content'
        assert note.note_type == 'general'
