import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import ChatbotResponse
from chatbot.train_model import train_model
import os

@pytest.mark.django_db
class TestChatbot:
    def setup_method(self):
        self.client = APIClient()
        
        # Ensure chatbot model is trained
        try:
            train_model()
        except Exception as e:
            print(f"Model training failed: {e}")
        
        # Ensure some predefined responses exist
        ChatbotResponse.objects.create(
            input_text='Hello', 
            response_text='Hi there! How can I help you today?'
        )

    def test_chatbot_exact_match(self):
        response = self.client.post(
            reverse('chatbot'), 
            {'input': 'Hello'}
        )
        assert response.status_code == status.HTTP_200_OK
        assert 'response_text' in response.data
        assert 'How can I help you today?' in response.data['response_text']

    def test_chatbot_fallback(self):
        response = self.client.post(
            reverse('chatbot'), 
            {'input': 'Random unknown input'}
        )
        assert response.status_code == status.HTTP_200_OK
        assert 'response_text' in response.data
        
        # Verify fallback response contains a helpful message
        fallback_response = response.data['response_text'].lower()
        assert any(phrase in fallback_response for phrase in [
            'could you',
            'help me understand',
            'rephrase',
            'tell me more'
        ])

    def test_empty_input(self):
        response = self.client.post(
            reverse('chatbot'), 
            {'input': ''}
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'error' in response.data
        assert response.data['error'] == 'Input is required'
