from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import User, Note, ProfilePicture, EmailVerificationToken, PasswordResetToken, MultiFactorAuthentication

class AccountsEndpointsTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
        self.client.force_authenticate(user=self.user)

    def test_user_registration(self):
        url = reverse('register')
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword',
            'password_confirmation': 'newpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_user_login(self):
        url = reverse('token_obtain_pair')
        data = {
            'email': 'test@example.com',
            'password': 'testpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_user_logout(self):
        url = reverse('logout')
        refresh_token = RefreshToken.for_user(self.user)
        response = self.client.post(url, {'refresh_token': str(refresh_token)}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_email_verification(self):
        url = reverse('email_verification')
        token = EmailVerificationToken.objects.create(user=self.user)
        data = {
            'token': token.token
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_password_reset_request(self):
        url = reverse('password_reset_request')
        data = {
            'email': 'test@example.com'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_password_reset_confirm(self):
        url = reverse('password_reset_confirm')
        token = PasswordResetToken.objects.create(user=self.user)
        data = {
            'token': token.token,
            'new_password': 'newpassword',
            'confirm_password': 'newpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_upload_profile_picture(self):
        url = reverse('upload_profile_picture')
        with open('/home/badr/Downloads/avatar.jpg', 'rb') as image:
            response = self.client.post(url, {'profile_picture': image}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_delete_profile_picture(self):
        ProfilePicture.objects.create(user=self.user, image='/home/badr/Downloads/avatar.jpg')
        url = reverse('delete_profile_picture')
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_reset_progress(self):
        url = reverse('reset_progress')
        response = self.client.post(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_note_crud(self):
        url = reverse('note-list')
        data = {
            'title': 'Test Note',
            'content': 'This is a test note'
        }
        # Create
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        note_id = response.data['id']

        # Read
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Update
        update_url = reverse('note-detail', args=[note_id])
        update_data = {
            'title': 'Updated Note',
            'content': 'This is an updated note'
        }
        response = self.client.put(update_url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Delete
        response = self.client.delete(update_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_recommended_lessons(self):
        url = reverse('recommended_lessons')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_profile_view(self):
        url = reverse('user_profile')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_statistics(self):
        url = reverse('user_statistics')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
