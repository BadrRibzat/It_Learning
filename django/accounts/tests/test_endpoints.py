import pytest  # Add this import
from django.urls import reverse
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.test import APITestCase
from accounts.models import User, Note, ProfilePicture, EmailVerificationToken, PasswordResetToken, MultiFactorAuthentication
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone
from datetime import timedelta

class AccountsEndpointsTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
        self.client.force_authenticate(user=self.user)

    def test_register_with_existing_email(self):
        url = reverse('register')
        data = {
            'username': 'anotheruser',
            'email': 'test@example.com',  # Existing email
            'password': 'ComplexPassword123!',
            'password_confirmation': 'ComplexPassword123!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_with_wrong_password(self):
        url = reverse('token_obtain_pair')
        data = {
            'email': 'test@example.com',
            'password': 'wrongpassword'  # Wrong password
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_without_token(self):
        url = reverse('logout')
        response = self.client.post(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_email_verification_with_invalid_token(self):
        url = reverse('email_verification')
        data = {
            'token': 'invalidtoken'  # Invalid token
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_reset_with_unregistered_email(self):
        url = reverse('password_reset_request')
        data = {
            'email': 'nonexistent@example.com'  # Unregistered email
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_reset_confirm_with_mismatched_passwords(self):
        token = PasswordResetToken.objects.create(user=self.user)
        token.generate_token()

        url = reverse('password_reset_confirm')
        data = {
            'token': token.token,
            'new_password': 'newPassword123!',
            'confirm_password': 'differentPassword123!'  # Passwords don't match
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @pytest.mark.django_db
    def test_upload_invalid_profile_picture(self):
        url = reverse('upload_profile_picture')
        image = SimpleUploadedFile("test_image.txt", b"file_content", content_type="text/plain")
        response = self.client.post(url, {'profile_picture': image}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_nonexistent_profile_picture(self):
        url = reverse('delete_profile_picture')
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_note_crud_with_invalid_data(self):
        url = reverse('note-list')
        data = {
            'title': '',  # Invalid title
            'content': 'This is a test note'
        }
        # Create
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Read
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @pytest.mark.django_db
    def test_get_recommended_lessons_while_logged_out(self):
        self.client.logout()
        url = reverse('recommended_lessons')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @pytest.mark.django_db
    def test_view_profile_of_another_user(self):
        another_user = User.objects.create_user(username='anotheruser', email='anotheruser@example.com', password='anotherpassword')
        url = reverse('user_profile', kwargs={'username': 'anotheruser'})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    @pytest.mark.django_db
    def test_view_statistics_of_another_user(self):
        another_user = User.objects.create_user(username='anotheruser', email='anotheruser@example.com', password='anotherpassword')
        url = reverse('user_statistics', kwargs={'username': 'anotheruser'})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
