from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LessonViewSet, FlashcardViewSet

router = DefaultRouter()
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'flashcards', FlashcardViewSet, basename='flashcard')

urlpatterns = [
    path('', include(router.urls)),
]
