from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LevelViewSet,
    LessonViewSet,
    FlashcardViewSet,
    QuizViewSet,
    UserProgressViewSet,
    FlashcardSubmissionView,
    IntermediateLevelTestSubmissionView
)

router = DefaultRouter()
router.register(r'levels', LevelViewSet, basename='level')
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'flashcards', FlashcardViewSet, basename='flashcard')
router.register(r'quizzes', QuizViewSet, basename='quiz')
router.register(r'progress', UserProgressViewSet, basename='user-progress')

urlpatterns = [
    path('lessons/<int:lesson_id>/submit-flashcards/', FlashcardSubmissionView.as_view(), name='lesson-submit-flashcards'),
    path('levels/<int:level_id>/submit-test/', IntermediateLevelTestSubmissionView.as_view(), name='intermediate-level-test-submit'),
    path('', include(router.urls)),
    path('progress/learning-metrics/', UserProgressViewSet.as_view({'get': 'learning_metrics'}), name='learning-metrics'),
    path('progress/comprehensive-learning-report/', UserProgressViewSet.as_view({'get': 'comprehensive_learning_report'}), name='comprehensive-learning-report'),
]
