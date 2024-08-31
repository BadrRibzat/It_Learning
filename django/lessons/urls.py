from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LessonViewSet, TestViewSet

router = DefaultRouter()
router.register(r'lessons', LessonViewSet)
router.register(r'tests', TestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
