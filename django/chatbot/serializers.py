from rest_framework import serializers
from .models import ChatbotResponse

class ChatbotResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatbotResponse

        fields = ['id', 'keyword', 'response']

        fields = ['input_text', 'response_text']

