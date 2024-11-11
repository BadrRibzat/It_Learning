from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ChatbotResponse
import spacy
import random

class ChatbotView(APIView):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        try:
            self.nlp = spacy.load("chatbot/model")
        except Exception as e:
            print(f"Error loading spaCy model: {e}")
            self.nlp = None

    def get_fallback_response(self):
        # Fallback to database responses if model fails
        fallback_responses = [
            "I'm not sure how to respond to that. Could you rephrase?",
            "That's an interesting point. Could you tell me more?",
            "I'm still learning. Can you help me understand better?",
        ]
        return random.choice(fallback_responses)

    def get_response(self, user_input):
        if not self.nlp:
            return self.get_fallback_response()

        try:
            # First, try to match exact input in database
            exact_match = ChatbotResponse.objects.filter(input_text__iexact=user_input).first()
            if exact_match:
                return exact_match.response_text

            # If no exact match, use NLP model
            doc = self.nlp(user_input)
            
            # Get the label with the highest score
            if doc.cats:
                response = max(doc.cats, key=doc.cats.get)
                return response
            
            # If no match found
            return self.get_fallback_response()
        
        except Exception as e:
            print(f"Error processing message: {e}")
            return self.get_fallback_response()

    def post(self, request):
        user_input = request.data.get('input') or request.data.get('message')
        
        if not user_input:
            return Response(
                {"error": "Input is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        response_text = self.get_response(user_input)
        return Response({
            "response_text": response_text,
            "data": {"response": response_text}
        }, status=status.HTTP_200_OK)
