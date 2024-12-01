import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User
from lessons.models import Level, Lesson, Flashcard, Quiz, QuizQuestion, LevelTest, LevelTestQuestion

@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
def test_flashcard_submit(api_client):
    user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
    api_client.force_authenticate(user=user)

    level = Level.objects.create(name='Beginner', position=1, passing_score=80, difficulty='beginner')
    lesson = Lesson.objects.create(title='Test Lesson', level=level, position=1)
    flashcard = Flashcard.objects.create(lesson=lesson, word='Test', definition='Test Definition', position=1)

    url = reverse('flashcard-submit')
    data = {
        'flashcard_id': flashcard.id,
        'user_answer': 'Test'
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_quiz_submit(api_client):
    user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
    api_client.force_authenticate(user=user)

    level = Level.objects.create(name='Beginner', position=1, passing_score=80, difficulty='beginner')
    lesson = Lesson.objects.create(title='Test Lesson', level=level, position=1)
    quiz = Quiz.objects.create(lesson=lesson, title='Test Quiz', total_questions=1, passing_score=80)
    question = QuizQuestion.objects.create(quiz=quiz, question_text='Test Question', correct_answer='Test Answer', position=1)

    url = reverse('quiz-submit')
    data = {
        'quiz_id': quiz.id,
        'answers': [
            {
                'question_id': question.id,
                'user_answer': 'Test Answer'
            }
        ]
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_level_test_submit(api_client):
    user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
    api_client.force_authenticate(user=user)

    level = Level.objects.create(name='Beginner', position=1, passing_score=80, difficulty='beginner')
    lesson = Lesson.objects.create(title='Test Lesson', level=level, position=1)
    level_test = LevelTest.objects.create(level=level, total_questions=1, passing_score=80)
    question = LevelTestQuestion.objects.create(level_test=level_test, question_text='Test Question', correct_answer='Test Answer', position=1)

    url = reverse('level-test-submit')
    data = {
        'level_test_id': level_test.id,
        'answers': [
            {
                'question_id': question.id,
                'user_answer': 'Test Answer'
            }
        ]
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_200_OK
