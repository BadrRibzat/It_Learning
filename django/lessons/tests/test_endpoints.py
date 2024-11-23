from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import User
from lessons.models import Level, Lesson, Flashcard, Quiz, QuizQuestion, LevelTestQuestion, LevelTest, UserProgress

class LessonsEndpointsTestCase(APITestCase):
    def setUp(self):
        # Create user
        self.user = User.objects.create_user(
            username='testuser', 
            email='test@example.com', 
            password='testpassword'
        )
    
        # Create level
        self.level = Level.objects.create(
            name='Beginner',
            position=1,
            passing_score=80,
            difficulty='beginner'
        )
    
        # Create lesson
        self.lesson = Lesson.objects.create(
            title='Test Lesson',
            level=self.level,
            position=1
        )
    
        # Create flashcard
        self.flashcard = Flashcard.objects.create(
            lesson=self.lesson,
            word='Test',
            definition='Test Definition',
            position=1
        )
    
        # Create quiz
        self.quiz = Quiz.objects.create(
            lesson=self.lesson,
            title='Test Quiz',
            total_questions=1,
            passing_score=80
        )
    
        # Create one quiz question
        self.question = QuizQuestion.objects.create(
            quiz=self.quiz,
            question_text='Test Question',
            correct_answer='Test Answer',
            position=1
        )
    
        # Authenticate
        self.client.force_authenticate(user=self.user)

    def test_flashcard_submit(self):
        # Delete existing flashcards to avoid position conflicts
        Flashcard.objects.all().delete()
    
        flashcard = Flashcard.objects.create(
            lesson=self.lesson,
            word="test",
            definition="A test word",
            fill_in_blank_template="This is a _____ word",
            blank_placeholder="_____",
            position=1
        )

        url = reverse('flashcard-submit')
        data = {
            'flashcard_id': flashcard.id,
            'user_answer': 'test'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_quiz_submit(self):
        QuizQuestion.objects.all().delete()
        
        question = QuizQuestion.objects.create(
            quiz=self.quiz,
            question_text='Test Question',
            correct_answer='Test Answer',
            position=1,
            blank_placeholder='______'
        )

        url = reverse('quiz-submit')
        data = {
            'quiz_id': self.quiz.id,
            'answers': [
                {
                    'question_id': question.id,
                    'user_answer': question.correct_answer
                }
            ]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_level_test_submit(self):
        lesson = Lesson.objects.create(
            title='Test Lesson for Level Test',
            level=self.level,
            position=2
        )
    
        level_test = LevelTest.objects.create(
            level=self.level,
            total_questions=1,
            passing_score=80
        )

        test_question = LevelTestQuestion.objects.create(
            level_test=level_test,
            question_text='Test Question',
            correct_answer='Test Answer',
            position=1,
            blank_placeholder='______'
        )

        # Create initial progress
        UserProgress.objects.create(
            user=self.user,
            lesson=lesson,
            level=self.level
        )

        url = reverse('level-test-submit')
        data = {
            'level_test_id': level_test.id,
            'answers': [
                {
                    'question_id': test_question.id,
                    'user_answer': test_question.correct_answer
                }
            ]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
