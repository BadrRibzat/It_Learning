import pytest
from chatbot.models import ChatbotResponse

@pytest.mark.django_db
def test_create_chatbot_response():
    response = ChatbotResponse.objects.create(
        input_text="Hello",
        response_text="Hi there! How can I help you today?"
    )
    assert response.input_text == "Hello"
    assert response.response_text == "Hi there! How can I help you today?"
