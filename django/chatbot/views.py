from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ChatbotResponse
import os
import joblib
import random
from rest_framework.permissions import AllowAny

class ChatbotView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.classifier, self.vectorizer, self.label_encoder = self.load_model()

    def load_model(self):
        try:
            model_dir = os.path.join(settings.BASE_DIR, 'chatbot', 'model')
            os.makedirs(model_dir, exist_ok=True)
        
            classifier_path = os.path.join(model_dir, 'classifier.pkl')
            vectorizer_path = os.path.join(model_dir, 'vectorizer.pkl')
            label_encoder_path = os.path.join(model_dir, 'label_encoder.pkl')
        
            # Fallback to model training if files don't exist
            if not all(os.path.exists(path) for path in [
                classifier_path, 
                vectorizer_path, 
                label_encoder_path
            ]):
                from .train_model import train_model
                return train_model()
        
            # Load models safely
            classifier = joblib.load(classifier_path)
            vectorizer = joblib.load(vectorizer_path)
            label_encoder = joblib.load(label_encoder_path)
        
            return classifier, vectorizer, label_encoder
    
        except Exception as e:
            print(f"Model Loading Error: {e}")
            # Fallback to basic responses
            return None, None, None

    def get_fallback_response(self):
        fallback_responses = [
            "I'm not sure how to respond to that. Could you rephrase?",
            "That's an interesting point. Could you tell me more?",
            "I'm still learning. Can you help me understand better?",
            "Could you clarify what you mean?",
            "Help me understand your question better.",
        ]
        return random.choice(fallback_responses)

    def get_response(self, user_input):
        if not all([self.classifier, self.vectorizer, self.label_encoder]):
            return self.get_fallback_response()

        try:
            # First, try to match exact input in database
            exact_match = ChatbotResponse.objects.filter(input_text__iexact=user_input).first()
            if exact_match:
                return exact_match.response_text

            # If no exact match, use ML model
            input_vectorized = self.vectorizer.transform([user_input])
            prediction = self.classifier.predict(input_vectorized)
            
            predicted_label_index = prediction[0]
            predicted_label = self.label_encoder.inverse_transform([predicted_label_index])[0]
            
            return predicted_label
        
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
