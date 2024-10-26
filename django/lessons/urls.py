from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LevelViewSet, LessonViewSet, FlashcardViewSet, QuizViewSet, QuizQuestionViewSet,
    UserProgressViewSet, UserFlashcardProgressViewSet, UserQuizAttemptViewSet, UserLevelProgressViewSet,
    recommend_next_lesson, flashcard_submit, level_test_submit
)

router = DefaultRouter()
router.register(r'levels', LevelViewSet)
router.register(r'lessons', LessonViewSet)
router.register(r'flashcards', FlashcardViewSet)
router.register(r'quizzes', QuizViewSet)
router.register(r'quiz-questions', QuizQuestionViewSet)
router.register(r'user-progress', UserProgressViewSet)
router.register(r'user-flashcard-progress', UserFlashcardProgressViewSet)
router.register(r'user-quiz-attempts', UserQuizAttemptViewSet)
router.register(r'user-level-progress', UserLevelProgressViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('recommend-next-lesson/', recommend_next_lesson, name='recommend_next_lesson'),
    path('flashcard-submit/<int:pk>/', flashcard_submit, name='flashcard-submit'),
    path('level-test-submit/<int:pk>/', level_test_submit, name='level-test-submit'),
]
