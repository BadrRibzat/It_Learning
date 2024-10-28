from django.urls import path
from .views import ChatbotView

urlpatterns = [
    path('chat/', ChatbotView.as_view(), name='chatbot'),
    path('chatbot/', ChatbotView.as_view(), name='chatbot'),
]
