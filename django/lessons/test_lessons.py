import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from lessons.models import Level, Lesson, Flashcard, Quiz, LevelTest, UserProgress, UserFlashcardProgress, UserLevelProgress
from django.template.loader import get_template
from django.contrib.admin.sites import AdminSite
from lessons.admin import LessonAdmin
from django.http import HttpResponse
from django.test import RequestFactory
from unittest.mock import patch

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user():
    return User.objects.create_user(username='testuser', email='test@example.com', password='testpass123')

@pytest.fixture
def level():
    return Level.objects.create(name='Beginner', level_order=1)

@pytest.fixture
def lesson(level):
    return Lesson.objects.create(title='Test Lesson', level=level, level_order=1, content='Test content')

@pytest.fixture
def flashcard(lesson):
    return Flashcard.objects.create(lesson=lesson, word='Test', meaning='A test word', question='What is this?')

@pytest.fixture
def quiz(lesson):
    return Quiz.objects.create(lesson=lesson, title='Test Quiz')

@pytest.fixture
def level_test(level):
    return LevelTest.objects.create(level=level)

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user():
    return User.objects.create_user(username='testuser', email='test@example.com', password='testpass123')

@pytest.fixture
def level():
    return Level.objects.create(name='Beginner', level_order=1)

@pytest.fixture
def lesson(level):
    return Lesson.objects.create(title='Test Lesson', level=level, content='Test content', level_order=1)

@pytest.mark.django_db
def test_get_levels_with_no_levels(api_client, user):
    api_client.force_authenticate(user=user)
    url = reverse('level-list')
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.data['count'] == 0  # Expecting no levels

@pytest.mark.django_db
def test_get_lessons_with_no_lessons(api_client, user):
    api_client.force_authenticate(user=user)
    url = reverse('lesson-list')
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.data['count'] == 0  # Expecting no lessons

@pytest.mark.django_db
def test_get_nonexistent_lesson(api_client, user):
    api_client.force_authenticate(user=user)
    url = reverse('lesson-detail', args=[999])  # Assuming 999 does not exist
    response = api_client.get(url)
    assert response.status_code == status.HTTP_404_NOT_FOUND

@pytest.mark.django_db
def test_get_nonexistent_level(api_client, user):
    api_client.force_authenticate(user=user)
    url = reverse('level-detail', args=[999])  # Assuming 999 does not exist
    response = api_client.get(url)
    assert response.status_code == status.HTTP_404_NOT_FOUND

@pytest.mark.django_db
def test_flashcard_view(api_client, flashcard, user):
    api_client.force_authenticate(user=user)
    response = api_client.get(reverse('flashcard-list'))
    assert response.status_code == status.HTTP_200_OK
    assert response.data['count'] == 1
    assert len(response.data['results']) == 1
    assert response.data['results'][0]['id'] == flashcard.id

@pytest.mark.django_db
def test_lesson_creation(lesson):
    assert lesson.title == 'Test Lesson'
    assert lesson.level.name == 'Beginner'
    assert lesson.content == 'Test content'

@pytest.mark.django_db
def test_level_creation(level):
    assert level.name == 'Beginner'
    assert level.level_order == 1

@pytest.mark.django_db
def test_flashcard_creation(flashcard):
    assert flashcard.word == 'Test'
    assert flashcard.lesson.title == 'Test Lesson'
    assert flashcard.meaning == 'A test word'
    assert flashcard.question == 'What is this?'

@pytest.mark.django_db
def test_quiz_creation(quiz):
    assert quiz.title == 'Test Quiz'
    assert quiz.lesson.title == 'Test Lesson'

@pytest.mark.django_db
def test_lesson_view(api_client, lesson, user):
    api_client.force_authenticate(user=user)
    response = api_client.get(reverse('lesson-list'))
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) > 0

@pytest.mark.django_db
def test_quiz_view(api_client, quiz, user):
    api_client.force_authenticate(user=user)
    response = api_client.get(reverse('quiz-list'))
    assert response.status_code == status.HTTP_200_OK
    assert response.data['count'] == 1
    assert len(response.data['results']) == 1
    assert response.data['results'][0]['id'] == quiz.id

@pytest.mark.django_db
def test_lesson_detail_view(api_client, lesson, user):
    api_client.force_authenticate(user=user)
    response = api_client.get(reverse('lesson-detail', args=[lesson.id]))
    assert response.status_code == status.HTTP_200_OK
    assert response.data['title'] == 'Test Lesson'

@pytest.mark.django_db
def test_user_flashcard_progress(api_client, user, level, lesson, flashcard):
    api_client.force_authenticate(user=user)
    response = api_client.post(reverse('flashcard-submit', kwargs={'pk': flashcard.id}), {'answer': 'Test'})
    assert response.status_code == status.HTTP_200_OK
    assert response.data['is_correct']

    progress = UserFlashcardProgress.objects.get(user=user, flashcard=flashcard)
    assert progress.completed

@pytest.mark.django_db
def test_user_level_progress(api_client, user, level, level_test):
    api_client.force_authenticate(user=user)
    response = api_client.post(reverse('level-test-submit', kwargs={'pk': level_test.id}), {'score': 75})
    assert response.status_code == status.HTTP_200_OK
    assert response.data['status'] == 'test completed'

    response = api_client.post(reverse('level-test-submit', kwargs={'pk': level_test.id}), {'score': 85})
    assert response.status_code == status.HTTP_200_OK
    assert response.data['status'] == 'level up'

    user.refresh_from_db()
    assert user.level == 2

    progress = UserLevelProgress.objects.get(user=user, level=level_test.level)
    assert progress.completed

@pytest.mark.django_db
def test_recommend_next_lesson(api_client, user, level, lesson):
    api_client.force_authenticate(user=user)
    response = api_client.get(reverse('recommend_next_lesson'))
    assert response.status_code == status.HTTP_200_OK
    assert response.data['id'] == lesson.id

@pytest.mark.django_db
def test_recommend_next_lesson_all_completed(api_client, user, level, lesson):
    api_client.force_authenticate(user=user)
    UserProgress.objects.create(user=user, lesson=lesson, completed=True)
    response = api_client.get(reverse('recommend_next_lesson'))
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.data['message'] == 'No more lessons available'

@pytest.mark.django_db
def test_get_levels(api_client, user):
    api_client.force_authenticate(user=user)
    url = reverse('level-list')
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_get_lessons(api_client, user):
    api_client.force_authenticate(user=user)
    url = reverse('lesson-list')
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
class TestLessonModels:
    def test_level_creation(self):
        level = Level.objects.create(name='Beginner', level_order=1)
        assert str(level) == 'Beginner'

    def test_lesson_creation(self):
        level = Level.objects.create(name='Beginner', level_order=1)
        lesson = Lesson.objects.create(title='Test Lesson', level=level, level_order=1, content='Test content')
        assert str(lesson) == 'Test Lesson'

    def test_flashcard_creation(self):
        level = Level.objects.create(name='Beginner', level_order=1)
        lesson = Lesson.objects.create(title='Test Lesson', level=level, level_order=1, content='Test content')
        flashcard = Flashcard.objects.create(lesson=lesson, word='Test', meaning='A test word', question='What is this?')
        assert str(flashcard) == 'Test'

    def test_quiz_creation(self):
        level = Level.objects.create(name='Beginner', level_order=1)
        lesson = Lesson.objects.create(title='Test Lesson', level=level, level_order=1, content='Test content')
        quiz = Quiz.objects.create(lesson=lesson, title='Test Quiz')
        assert str(quiz) == 'Test Quiz'

    def test_level_test_creation(self):
        level = Level.objects.create(name='Beginner', level_order=1)
        level_test = LevelTest.objects.create(level=level)
        assert str(level_test) == 'Level Test for Beginner'

    def test_user_progress_creation(self):
        user = User.objects.create_user(username='testuser', email='test@example.com', password='testpass123')
        level = Level.objects.create(name='Beginner', level_order=1)
        lesson = Lesson.objects.create(title='Test Lesson', level=level, level_order=1, content='Test content')
        progress = UserProgress.objects.create(user=user, lesson=lesson)
        assert str(progress) == "testuser's progress on Test Lesson"

    def test_user_flashcard_progress_creation(self):
        user = User.objects.create_user(username='testuser', email='test@example.com', password='testpass123')
        level = Level.objects.create(name='Beginner', level_order=1)
        lesson = Lesson.objects.create(title='Test Lesson', level=level, level_order=1, content='Test content')
        flashcard = Flashcard.objects.create(lesson=lesson, word='Test', meaning='A test word', question='What is this?')
        progress = UserFlashcardProgress.objects.create(user=user, flashcard=flashcard)
        assert str(progress) == "testuser's progress on Test"

    def test_user_level_progress_creation(self):
        user = User.objects.create_user(username='testuser', email='test@example.com', password='testpass123')
        level = Level.objects.create(name='Beginner', level_order=1)
        progress = UserLevelProgress.objects.create(user=user, level=level)
        assert str(progress) == "testuser's progress on Beginner"

@pytest.mark.django_db
class TestLessonAdmin:
    def test_custom_view(self):
        site = AdminSite()
        lesson_admin = LessonAdmin(Lesson, site)
        
        level = Level.objects.create(name='Beginner', level_order=1)
        Lesson.objects.create(title='Test Lesson', level=level, level_order=1, content='Test content')
        
        user = User.objects.create_superuser('admin', 'admin@example.com', 'password')
        request = RequestFactory().get('/admin/lessons/lesson/custom-view/')
        request.user = user
        
        with patch('lessons.admin.render') as mock_render:
            mock_render.return_value = HttpResponse('Mock Rendered Template')
            response = lesson_admin.custom_view(request)
            
            assert isinstance(response, HttpResponse)
            mock_render.assert_called_once_with(
                request, 
                'admin/custom_lesson_view.html', 
                {'lessons': list(Lesson.objects.all())}
            )
