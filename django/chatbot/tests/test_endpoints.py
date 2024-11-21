from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import User

class ChatbotEndpointsTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
        self.client.force_authenticate(user=self.user)

    def test_chatbot_response(self):
        url = reverse('chatbot')
        data = {
            'input': 'Hello'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
