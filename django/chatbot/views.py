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

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import ChatbotResponse
from .serializers import ChatbotResponseSerializer

class ChatbotView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_input = request.data.get('input')
        if not user_input:
            return Response({"error": "Input is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            response = ChatbotResponse.objects.get(input_text__iexact=user_input)
            serializer = ChatbotResponseSerializer(response)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ChatbotResponse.DoesNotExist:
            return Response({"response_text": "I don't have an answer for that. Please try something else."}, status=status.HTTP_200_OK)

