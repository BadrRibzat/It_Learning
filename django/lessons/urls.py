from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LessonViewSet, FlashcardViewSet

router = DefaultRouter()
router.register(r'lessons', LessonViewSet)
router.register(r'flashcards', FlashcardViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
