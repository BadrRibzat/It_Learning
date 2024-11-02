from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ChatbotResponse
from .serializers import ChatbotResponseSerializer
import spacy

class ChatbotView(APIView):
    def __init__(self):
        self.nlp = spacy.load("chatbot/model")

    def get_response(self, user_input):
        doc = self.nlp(user_input)
        response = max(doc.cats, key=doc.cats.get)
        return response

    def post(self, request):
        user_input = request.data.get('input')
        if not user_input:
            return Response({"error": "Input is required"}, status=status.HTTP_400_BAD_REQUEST)

        response = self.get_response(user_input)
        return Response({"response_text": response}, status=status.HTTP_200_OK)
