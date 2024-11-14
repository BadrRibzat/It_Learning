from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LevelViewSet,
    LessonViewSet,
    FlashcardViewSet,
    QuizViewSet,
    UserProgressViewSet
)

router = DefaultRouter()
router.register(r'levels', LevelViewSet, basename='level')
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'flashcards', FlashcardViewSet, basename='flashcard')
router.register(r'quizzes', QuizViewSet, basename='quiz')
router.register(r'progress', UserProgressViewSet, basename='user-progress')

urlpatterns = [
    path('', include(router.urls)),
    path('levels/<int:level_pk>/lessons/', LevelViewSet.as_view({'get': 'lessons'}), name='level-lessons'),
    path('lessons/<int:lesson_pk>/flashcards/', LessonViewSet.as_view({'get': 'flashcards'}), name='lesson-flashcards'),
    path('lessons/<int:lesson_pk>/quizzes/', LessonViewSet.as_view({'get': 'quizzes'}), name='lesson-quizzes'),
    path('flashcards/<int:pk>/check-answer/', FlashcardViewSet.as_view({'post': 'check_answer'}), name='flashcard-check-answer'),
    path('quizzes/<int:pk>/submit/', QuizViewSet.as_view({'post': 'submit'}), name='quiz-submit'),
    path('progress/learning/', UserProgressViewSet.as_view({'get': 'learning_progress'}), name='learning-progress'),
    path('progress/detailed/', UserProgressViewSet.as_view({'get': 'detailed_progress'}), name='detailed-progress'),
    path('progress/completed-lessons/', UserProgressViewSet.as_view({'get': 'completed_lessons'}), name='completed-lessons'),
    path('progress/current-level/', UserProgressViewSet.as_view({'get': 'current_level_details'}), name='current-level-details'),
    path('recommendations/next-lessons/', UserProgressViewSet.as_view({'get': 'recommended_lessons'}), name='recommended-lessons'),
    path('progress/metrics/', UserProgressViewSet.as_view({'get': 'learning_metrics'}), name='learning-metrics'),
]
