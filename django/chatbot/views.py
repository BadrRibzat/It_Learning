from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ChatbotResponse
from .serializers import ChatbotResponseSerializer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

nltk.download('punkt')
nltk.download('stopwords')

class ChatbotView(APIView):
    def __init__(self):
        self.vectorizer = TfidfVectorizer()
        self.responses = ChatbotResponse.objects.all()
        self.corpus = [response.input_text for response in self.responses]
        self.vectorizer.fit(self.corpus)

    def get_response(self, user_input):
        user_vector = self.vectorizer.transform([user_input])
        corpus_vectors = self.vectorizer.transform(self.corpus)
        similarities = cosine_similarity(user_vector, corpus_vectors)
        best_match_index = similarities.argmax()
        return self.responses[best_match_index].response_text

    def post(self, request):
        user_input = request.data.get('input')
        if not user_input:
            return Response({"error": "Input is required"}, status=status.HTTP_400_BAD_REQUEST)

        response = self.get_response(user_input)
        return Response({"response_text": response}, status=status.HTTP_200_OK)
