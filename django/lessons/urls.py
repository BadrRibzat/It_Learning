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
    path('flashcards/submit-answer/', 
         FlashcardViewSet.as_view({'post': 'submit_answer'}),
         name='flashcard-submit'),
    path('quizzes/submit-quiz/',
         QuizViewSet.as_view({'post': 'submit_quiz'}),
         name='quiz-submit'),
    path('level-tests/submit-test/',
         LevelTestViewSet.as_view({'post': 'submit_test'}),
         name='level-test-submit'),
]
