from lessons.models import Level, Lesson, Flashcard, Quiz, LevelTest
from accounts.models import Badge
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user():
    return User.objects.create_user(username='testuser', email='testuser@example.com', password='testpassword')

@pytest.fixture
def level():
    return Level.objects.create(name='Beginner', level_order=1)

@pytest.fixture
def lesson(level):
    return Lesson.objects.create(title='Test Lesson', level=level, content='Test content', level_order=1, difficulty='beginner')

@pytest.fixture
def flashcard(lesson):
    return Flashcard.objects.create(word='Test Word', lesson=lesson, meaning='Test Meaning', question='Test Question')

@pytest.fixture
def level_test(level):
    return LevelTest.objects.create(level=level)

@pytest.fixture
def badge():
    return Badge.objects.create(name="Level Up", description="Leveled up!")

@pytest.fixture
def quiz(lesson):
    return Quiz.objects.create(title='Test Quiz', lesson=lesson)
