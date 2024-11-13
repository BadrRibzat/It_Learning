from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LessonViewSet,
    FlashcardViewSet,
    QuizViewSet,
    LevelTestViewSet,
    UserProgressViewSet
)

router = DefaultRouter()
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'flashcards', FlashcardViewSet, basename='flashcard')
router.register(r'levels', LevelTestViewSet, basename='level')
router.register(r'user-progress', UserProgressViewSet, basename='user-progress')

urlpatterns = [
    path('', include(router.urls)),
    path('lessons/<int:pk>/quizzes/',
        QuizViewSet.as_view({'get': 'list'}),
        name='lesson-quizzes'),
    path('lessons/<int:pk>/submit-quiz/',
        QuizViewSet.as_view({'post': 'submit_quiz'}),
        name='submit-quiz'),
    path('levels/<int:pk>/test/',
        LevelTestViewSet.as_view({'get': 'get_test'}),
        name='level-test'),
    path('levels/<int:pk>/test/submit/',
        LevelTestViewSet.as_view({'post': 'submit_test'}),
        name='submit-level-test'),
    path('user/progress/',
        UserProgressViewSet.as_view({'get': 'progress'}),
        name='user-progress'),
]
