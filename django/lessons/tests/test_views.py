import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from lessons.models import Level, Lesson
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
class TestLessonViews:
    def setup_method(self, method):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass123')
        self.client.force_authenticate(user=self.user)
        self.level = Level.objects.create(name="Beginner", level_order=1)
        self.lesson = Lesson.objects.create(
            title="Basic Greetings",
            level=self.level,
            level_order=1,
            content="Learn common English greetings",
            difficulty="beginner"
        )

    def test_get_lessons(self):
        url = reverse('lesson-list')
        response = self.client.get(url)
        assert response.status_code == 200
        assert len(response.data) == 1
        assert response.data[0]['title'] == "Basic Greetings"

    def test_get_lesson_detail(self):
        url = reverse('lesson-detail', kwargs={'pk': self.lesson.pk})
        response = self.client.get(url)
        assert response.status_code == 200
        assert response.data['title'] == "Basic Greetings"
