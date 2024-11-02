import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
class TestChatbotViews:
    def setup_method(self, method):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass123')
        self.client.force_authenticate(user=self.user)

    def test_chatbot_interaction(self):
        url = reverse('chatbot')
        payload = {'input': 'Hello'}
        response = self.client.post(url, payload)
        assert response.status_code == 200
        assert 'response_text' in response.data
