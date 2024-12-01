import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User

@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
def test_chatbot_response(api_client):
    user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
    api_client.force_authenticate(user=user)

    url = reverse('chatbot')
    data = {
        'input': 'Hello'
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_200_OK
