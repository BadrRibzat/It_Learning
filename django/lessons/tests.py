import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Level, Lesson, Flashcard, Quiz, UserProgress
from accounts.models import User
from rest_framework_simplejwt.tokens import RefreshToken

@pytest.mark.django_db
class TestLessons:
    def setup_method(self):
        self.client = APIClient()
        # Create levels and lessons
        self.beginner_level = Level.objects.create(name='Beginner', level_order=1)
        self.lesson = Lesson.objects.create(
            title='Test Lesson', 
            level=self.beginner_level, 
            content='Test Content',
            difficulty='beginner'
        )
        
        # Create a user
        self.user = User.objects.create_user(
            username='lessonuser', 
            email='lessonuser@example.com', 
            password='StrongPass123!',
            level=1
        )
        # Manually create a token for authentication
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

    def test_get_lessons(self):
        response = self.client.get(reverse('lesson-list'))
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) > 0
        
        # Verify lesson details
        first_lesson = response.data[0]
        assert 'id' in first_lesson
        assert 'title' in first_lesson
        assert 'content' in first_lesson

    def test_lesson_detail(self):
        response = self.client.get(reverse('lesson-detail', kwargs={'pk': self.lesson.id}))
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == 'Test Lesson'
        
        # Verify additional lesson details
        assert 'id' in response.data
        assert 'content' in response.data
        assert 'difficulty' in response.data

@pytest.mark.django_db
class TestFlashcards:
    def setup_method(self):
        self.client = APIClient()
        # Create levels, lessons, and flashcards
        self.level = Level.objects.create(name='Beginner', level_order=1)
        self.lesson = Lesson.objects.create(
            title='Flashcard Lesson', 
            level=self.level, 
            content='Test Content',
            difficulty='beginner'
        )
        self.flashcard = Flashcard.objects.create(
            lesson=self.lesson,
            word='Test Word',
            definition='Test Definition',
            example='Test Example'
        )
        
        # Create a user
        self.user = User.objects.create_user(
            username='flashcarduser', 
            email='flashcarduser@example.com', 
            password='StrongPass123!',
            level=1
        )
        # Manually create a token for authentication
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

    def test_get_flashcards(self):
        response = self.client.get(reverse('flashcard-list') + f'?lesson_id={self.lesson.id}')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) > 0
        
        # Verify flashcard details
        first_flashcard = response.data[0]
        assert 'id' in first_flashcard
        assert 'word' in first_flashcard
        assert 'definition' in first_flashcard

    def test_check_flashcard_answer(self):
        response = self.client.post(
            reverse('flashcard-check-answer', kwargs={'pk': self.flashcard.id}),
            {'answer': 'Test Word'}
        )
        assert response.status_code == status.HTTP_200_OK
        assert 'is_correct' in response.data
        assert 'correct_answer' in response.data
        assert 'points_earned' in response.data
        assert response.data['is_correct'] is True
        assert response.data['correct_answer'] == 'Test Word'
        assert response.data['points_earned'] == 5
