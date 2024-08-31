from rest_framework.views import APIView
from rest_framework.response import Response
from .models import ChatbotResponse

class ChatbotView(APIView):
    def post(self, request):
        user_message = request.data.get('message', '').lower()
        
        # Simple keyword matching
        response = ChatbotResponse.objects.filter(keyword__in=user_message.split()).first()
        
        if response:
            return Response({'message': response.response})
        else:
            return Response({'message': "I'm sorry, I don't understand. Can you please rephrase your question?"})
