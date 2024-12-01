import pytest
from chatbot.models import ChatbotResponse

@pytest.mark.django_db
def test_chatbot_response_creation():
    response = ChatbotResponse.objects.create(input_text='Hello', response_text='Hi there!')
    assert response.input_text == 'Hello'
    assert response.response_text == 'Hi there!'
