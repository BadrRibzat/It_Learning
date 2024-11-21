from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import User
from lessons.models import Level, Lesson, Flashcard, Quiz, LevelTest

class LessonsEndpointsTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
        self.client.force_authenticate(user=self.user)
        self.level = Level.objects.create(name='Beginner', position=1, passing_score=80)
        self.lesson = Lesson.objects.create(title='Test Lesson', level=self.level, position=1)
        self.flashcard = Flashcard.objects.create(lesson=self.lesson, word='Test', definition='Test Definition', position=1)
        self.quiz = Quiz.objects.create(lesson=self.lesson, title='Test Quiz', total_questions=10, passing_score=80)
        self.level_test = LevelTest.objects.create(level=self.level, total_questions=10, passing_score=80)

    def test_level_list(self):
        url = reverse('level-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_lesson_list(self):
        url = reverse('lesson-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_flashcard_list(self):
        url = reverse('flashcard-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_quiz_list(self):
        url = reverse('quiz-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_level_test_list(self):
        url = reverse('level-test-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_flashcard_submit(self):
        url = reverse('flashcard-submit')
        data = {
            'flashcard_id': self.flashcard.id,
            'user_answer': 'Test'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_quiz_submit(self):
        url = reverse('quiz-submit')
        data = {
            'quiz_id': self.quiz.id,
            'answers': [{'question_id': 1, 'user_answer': 'Test'}]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_level_test_submit(self):
        url = reverse('level-test-submit')
        data = {
            'level_test_id': self.level_test.id,
            'answers': [{'question_id': 1, 'user_answer': 'Test'}]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
