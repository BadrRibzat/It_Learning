import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
class TestUserViews:
    def setup_method(self, method):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.login_url = reverse('token_obtain_pair')

    def test_user_registration(self):
        payload = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'testpass123',
            'password_confirmation': 'testpass123'
        }
        response = self.client.post(self.register_url, payload)
        assert response.status_code == 201
        assert User.objects.count() == 1
        assert User.objects.get().username == 'testuser'

    def test_user_login(self):
        user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass123')
        payload = {
            'email': 'testuser@example.com',
            'password': 'testpass123'
        }
        response = self.client.post(self.login_url, payload)
        assert response.status_code == 200
        assert 'access' in response.data
        assert 'refresh' in response.data
