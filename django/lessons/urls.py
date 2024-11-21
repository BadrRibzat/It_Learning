from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LevelViewSet, 
    LessonViewSet, 
    FlashcardViewSet, 
    QuizViewSet, 
    LevelTestViewSet
)

router = DefaultRouter()
router.register(r'levels', LevelViewSet, basename='level')
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'flashcards', FlashcardViewSet, basename='flashcard')
router.register(r'quizzes', QuizViewSet, basename='quiz')
router.register(r'level-tests', LevelTestViewSet, basename='level-test')

urlpatterns = [
    path('', include(router.urls)),
    
    # Flashcard-specific endpoints
    path('flashcards/submit/', FlashcardViewSet.as_view({
        'post': 'submit_answer'
        }), name='flashcard-submit'),
    
    # Quiz-specific endpoints
    path('quizzes/submit/', QuizViewSet.as_view({
        'post': 'submit_quiz'
        }), name='quiz-submit'),
    
    # Level Test-specific endpoints
    path('level-tests/submit/', LevelTestViewSet.as_view({
        'post': 'submit_test'
        }), name='level-test-submit'),
]
