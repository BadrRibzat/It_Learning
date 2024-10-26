import pytest
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from chatbot.models import ChatbotResponse

User = get_user_model()

@pytest.fixture
def authenticated_client(api_client):
    user = User.objects.create_user(username='testuser', password='testpassword')
    api_client.force_authenticate(user=user)
    return api_client

@pytest.mark.django_db
def test_chatbot_response(authenticated_client):
    response = authenticated_client.post(reverse('chatbot'), {'input': 'Hello'})
    assert response.status_code == status.HTTP_200_OK
    assert 'response_text' in response.data

@pytest.mark.django_db
def test_chatbot_response_model():
    chatbot_response = ChatbotResponse.objects.create(input_text="Hello", response_text="Hi there!")
    assert str(chatbot_response) == "Response for: Hello"

@pytest.mark.django_db
def test_chatbot_no_input(authenticated_client):
    response = authenticated_client.post(reverse('chatbot'), {})
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data['error'] == 'Input is required'

@pytest.mark.django_db
def test_chatbot_unknown_input(authenticated_client):
    response = authenticated_client.post(reverse('chatbot'), {'input': 'Unknown input'})
    assert response.status_code == status.HTTP_200_OK
    assert 'response_text' in response.data

@pytest.mark.django_db
def test_chatbot_view_post(authenticated_client):
    ChatbotResponse.objects.create(input_text="Hello", response_text="Hi there!")
    response = authenticated_client.post(reverse('chatbot'), {'input': 'Hello'})
    assert response.status_code == status.HTTP_200_OK
    assert 'response_text' in response.data
    assert response.data['response_text'] == "Hi there!"

@pytest.mark.django_db
def test_chatbot_response(authenticated_client):
    response = authenticated_client.post(reverse('chatbot'), {'input': 'Hello'})
    assert response.status_code == status.HTTP_200_OK
    assert 'response_text' in response.data

@pytest.mark.django_db
def test_chatbot_view_post_unknown_input(authenticated_client):
    response = authenticated_client.post(reverse('chatbot'), {'input': 'Unknown input'})
    assert response.status_code == status.HTTP_200_OK
    assert 'response_text' in response.data
    assert response.data['response_text'] == "I don't have an answer for that. Please try something else."

@pytest.fixture
def authenticated_client(api_client):
    user = User.objects.create_user(username='testuser', password='testpassword')
    api_client.force_authenticate(user=user)
    return api_client

@pytest.mark.django_db
def test_chatbot_response_with_unknown_input(authenticated_client):
    response = authenticated_client.post(reverse('chatbot'), {'input': 'Unknown input'})
    assert response.status_code == status.HTTP_200_OK
    assert 'response_text' in response.data
    assert response.data['response_text'] == "I don't have an answer for that. Please try something else."

@pytest.mark.django_db
def test_chatbot_no_input(authenticated_client):
    response = authenticated_client.post(reverse('chatbot'), {})
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data['error'] == 'Input is required'
