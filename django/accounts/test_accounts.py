import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APIRequestFactory
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.models import Badge, UserBadge, ProfilePicture, Note
from accounts.serializers import UserSerializer, UserProfileSerializer, NoteSerializer
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from unittest.mock import patch
from django.core import mail
import tempfile
from PIL import Image
from accounts.utils import ensure_schema
from accounts.tasks import send_password_reset_email
from accounts.permissions import IsOwnerOrReadOnly
from accounts.exceptions import custom_exception_handler
from rest_framework.exceptions import APIException
from django.db import connection
from django.apps import apps
from unittest.mock import MagicMock

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user():
    return User.objects.create_user(username='testuser', email='test@example.com', password='testpass123')

@pytest.fixture
def temp_image():
    image = Image.new('RGB', (100, 100))
    tmp_file = tempfile.NamedTemporaryFile(suffix='.jpg')
    image.save(tmp_file)
    tmp_file.seek(0)
    return tmp_file

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user():
    return User.objects.create_user(username='testuser', email='test@example.com', password='testpass123')

@pytest.mark.django_db
def test_register_view_with_bad_request(api_client):
    url = reverse('register')
    # Missing required fields
    data = {
        'username': '',  # Invalid username
        'email': 'newuser@example.com',
        'password': 'newpassword123'
    }
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'username' in response.data

@pytest.mark.django_db
def test_login_view_with_bad_request(api_client):
    url = reverse('token_obtain_pair')
    # Invalid credentials
    data = {
        'email': 'wrong@example.com',
        'password': 'wrongpassword'
    }
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_logout_view_with_bad_request(api_client, user):
    refresh = RefreshToken.for_user(user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    url = reverse('logout')
    # Missing refresh token
    response = api_client.post(url, {})
    assert response.status_code == status.HTTP_205_RESET_CONTENT

@pytest.mark.django_db
def test_password_reset_view_with_invalid_email(api_client):
    url = reverse('password_reset')
    response = api_client.post(url, {'email': 'nonexistent@example.com'})
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert len(mail.outbox) == 0  # No email should be sent

@pytest.mark.django_db
def test_password_reset_confirm_with_invalid_token(api_client, user):
    token = 'invalid-token'
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    url = reverse('password_reset_confirm', kwargs={'uidb64': uid, 'token': token})
    response = api_client.post(url, {'new_password': 'newpassword123'})
    assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
def test_register_view(api_client):
    url = reverse('register')
    data = {
        'username': 'newuser',
        'email': 'newuser@example.com',
        'password': 'newpassword123'
    }
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_201_CREATED
    assert 'refresh' in response.data
    assert 'access' in response.data
    assert 'user' in response.data

@pytest.mark.django_db
def test_successful_registration(api_client):
    url = reverse('register')
    data = {
        'username': 'newuser',
        'email': 'newuser@example.com',
        'password': 'newpassword123'
    }
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_201_CREATED
    assert 'refresh' in response.data
    assert 'access' in response.data

@pytest.mark.django_db
def test_register_view_with_existing_email(api_client):
    User.objects.create_user(username='existinguser', email='testuser@example.com', password='existingpassword123')
    url = reverse('register')
    data = {
        'username': 'newuser',
        'email': 'testuser@example.com',
        'password': 'newpassword123'
    }
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'email' in response.data
    assert 'user with this email already exists.' in str(response.data['email'][0])

@pytest.mark.django_db
def test_login_view(api_client, user):
    url = reverse('token_obtain_pair')
    data = {
        'email': 'test@example.com',
        'password': 'testpass123'
    }
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_200_OK
    assert 'refresh' in response.data
    assert 'access' in response.data

@pytest.mark.django_db
def test_successful_login(api_client, user):
    url = reverse('token_obtain_pair')
    data = {
        'email': 'test@example.com',
        'password': 'testpass123'
    }
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_200_OK
    assert 'refresh' in response.data
    assert 'access' in response.data

@pytest.mark.django_db
def test_login_view_with_incorrect_password(api_client, user):
    url = reverse('token_obtain_pair')
    data = {
        'email': 'test@example.com',
        'password': 'wrongpassword'
    }
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_logout_view(api_client, user):
    refresh = RefreshToken.for_user(user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    url = reverse('logout')
    data = {'refresh_token': str(refresh)}
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_205_RESET_CONTENT
    assert 'detail' in response.data

@pytest.mark.django_db
def test_custom_token_obtain_pair_view(api_client, user):
    response = api_client.post(reverse('token_obtain_pair'), {
        'email': 'test@example.com',
        'password': 'testpass123'
    }, format='json')
    assert response.status_code == status.HTTP_200_OK
    assert 'access' in response.data
    assert 'refresh' in response.data

@pytest.mark.django_db
def test_profile_view(api_client, user):
    api_client.force_authenticate(user=user)
    response = api_client.get(reverse('user_profile'))
    assert response.status_code == status.HTTP_200_OK
    assert response.data['email'] == user.email

@pytest.mark.django_db
def test_user_statistics_view(api_client, user):
    api_client.force_authenticate(user=user)
    response = api_client.get(reverse('user_statistics'))
    assert response.status_code == status.HTTP_200_OK
    assert 'completed_lessons' in response.data
    assert 'total_lessons' in response.data
    assert 'correct_flashcards' in response.data
    assert 'total_flashcards' in response.data
    assert 'current_level' in response.data

@pytest.mark.django_db
def test_password_reset_view(api_client, user):
    response = api_client.post(reverse('password_reset'), {'email': user.email}, format='json')
    assert response.status_code == status.HTTP_200_OK
    assert 'detail' in response.data

@pytest.mark.django_db
def test_password_reset_request(api_client, user):
    url = reverse('password_reset')
    response = api_client.post(url, {'email': user.email})
    assert response.status_code == status.HTTP_200_OK
    assert len(mail.outbox) == 1

@pytest.mark.django_db
def test_password_reset_confirm_view(api_client, user):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    response = api_client.post(reverse('password_reset_confirm', kwargs={'uidb64': uid, 'token': token}), {'new_password': 'NewPassword123!'}, format='json')
    assert response.status_code == status.HTTP_200_OK
    assert 'detail' in response.data

@pytest.mark.django_db
def test_password_reset_confirm(api_client, user):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    url = reverse('password_reset_confirm', kwargs={'uidb64': uid, 'token': token})
    response = api_client.post(url, {'new_password': 'newpassword123'})
    assert response.status_code == status.HTTP_200_OK
    user.refresh_from_db()
    assert user.check_password('newpassword123')

@pytest.mark.django_db
def test_create_note(api_client, user):
    api_client.force_authenticate(user=user)
    url = reverse('note-list')
    data = {'content': 'Test note content', 'note_type': 'vocab'}
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_201_CREATED
    assert Note.objects.count() == 1
    assert Note.objects.first().content == 'Test note content'

@pytest.mark.django_db
def test_get_notes(api_client, user):
    api_client.force_authenticate(user=user)
    url = reverse('note-list')
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert 'results' in response.data

@pytest.mark.django_db
def test_update_note(api_client, user):
    api_client.force_authenticate(user=user)
    note = Note.objects.create(user=user, content='Original content')
    url = reverse('note-detail', kwargs={'pk': note.id})
    data = {'content': 'Updated content', 'note_type': 'vocab'}
    response = api_client.put(url, data)
    assert response.status_code == status.HTTP_200_OK
    note.refresh_from_db()
    assert note.content == 'Updated content'

@pytest.mark.django_db
def test_delete_note(api_client, user):
    api_client.force_authenticate(user=user)
    note = Note.objects.create(user=user, content='Note to delete')
    url = reverse('note-detail', kwargs={'pk': note.id})
    response = api_client.delete(url)
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert Note.objects.count() == 0

@pytest.mark.django_db
def test_user_reset_progress(user):
    user.points = 100
    user.level = 5
    user.save()
    user.reset_progress()
    user.refresh_from_db()
    assert user.points == 0
    assert user.level == 1

@pytest.mark.django_db
def test_user_get_recommended_lessons(user):
    from lessons.models import Level, Lesson
    next_level = Level.objects.create(name='Intermediate', level_order=2)
    recommended_lesson = Lesson.objects.create(title='Recommended Lesson', content='Test content', level=next_level, level_order=1)
    recommended_lessons = user.get_recommended_lessons()
    assert len(recommended_lessons) == 1
    assert recommended_lessons[0].title == 'Recommended Lesson'

@pytest.mark.django_db
def test_user_award_badge(user):
    badge = Badge.objects.create(name='Test Badge', description='Test Description')
    user.award_badge(badge)
    assert UserBadge.objects.filter(user=user, badge=badge).exists()

@pytest.mark.django_db
def test_user_award_points(user):
    user.award_points(50)
    user.refresh_from_db()
    assert user.points == 50

@pytest.mark.django_db
def test_user_pass_level_test(user, level_test, badge):
    assert user.pass_level_test(level_test, 85)
    user.refresh_from_db()
    assert user.level == 2
    assert user.points == 100
    assert UserBadge.objects.filter(user=user, badge=badge).exists()


@pytest.mark.django_db
def test_badge_model():
    badge = Badge.objects.create(name="Test Badge", description="Test Description")
    assert str(badge) == "Test Badge"

@pytest.mark.django_db
def test_user_badge_model(user):
    badge = Badge.objects.create(name='Test Badge', description='Test Description')
    user_badge = UserBadge.objects.create(user=user, badge=badge)
    assert str(user_badge) == f"{user.username} earned {badge.name}"

@pytest.mark.django_db
def test_profile_picture_model(user):
    profile_picture = ProfilePicture.objects.create(user=user, image="test_image.jpg")
    assert str(profile_picture) == f"{user.username}'s Profile Picture"

@pytest.mark.django_db
def test_note_model(user):
    note = Note.objects.create(user=user, content="Test Note Content")
    assert str(note) == f"{user.username}'s Note"

@pytest.mark.django_db
def test_upload_profile_picture(api_client, user, temp_image):
    api_client.force_authenticate(user=user)
    url = reverse('upload_profile_picture')
    response = api_client.post(url, {'profile_picture': temp_image}, format='multipart')
    assert response.status_code == status.HTTP_200_OK
    assert ProfilePicture.objects.filter(user=user).exists()

@pytest.mark.django_db
def test_upload_profile_picture_with_invalid_file(api_client, user):
    api_client.force_authenticate(user=user)
    url = reverse('upload_profile_picture')
    response = api_client.post(url, {'profile_picture': 'invalid_file.txt'}, format='multipart')
    assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
def test_reset_progress(api_client, user):
    api_client.force_authenticate(user=user)
    url = reverse('reset_progress')
    response = api_client.post(url)
    assert response.status_code == status.HTTP_200_OK
    user.refresh_from_db()
    assert user.points == 0
    assert user.level == 1

@pytest.mark.django_db
def test_password_reset(api_client, user):
    url = reverse('password_reset')
    response = api_client.post(url, {'email': user.email})
    assert response.status_code == status.HTTP_200_OK
    assert len(mail.outbox) == 1
    assert mail.outbox[0].subject == 'Password Reset'

@pytest.mark.django_db
def test_password_reset_confirm(api_client, user):
    from django.utils.encoding import force_bytes
    from django.utils.http import urlsafe_base64_encode
    from django.contrib.auth.tokens import default_token_generator
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    url = reverse('password_reset_confirm', kwargs={'uidb64': uid, 'token': token})
    response = api_client.post(url, {'new_password': 'newpassword123'})
    assert response.status_code == status.HTTP_200_OK
    user.refresh_from_db()
    assert user.check_password('newpassword123')

@pytest.mark.django_db
def test_note_viewset(api_client, user):
    api_client.force_authenticate(user=user)
    url = reverse('note-list')
    response = api_client.post(url, {'content': 'Test note', 'note_type': 'general'})
    assert response.status_code == status.HTTP_201_CREATED
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.data['count'] == 1
    note_id = response.data['results'][0]['id']
    detail_url = reverse('note-detail', kwargs={'pk': note_id})
    response = api_client.get(detail_url)
    assert response.status_code == status.HTTP_200_OK
    response = api_client.put(detail_url, {'content': 'Updated note', 'note_type': 'general'})
    assert response.status_code == status.HTTP_200_OK
    assert response.data['content'] == 'Updated note'
    response = api_client.delete(detail_url)
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not Note.objects.filter(id=note_id).exists()

@pytest.mark.django_db
def test_recommended_lessons_view(api_client, user):
    api_client.force_authenticate(user=user)
    url = reverse('recommended_lessons')
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_update_current_lesson(api_client, user):
    from lessons.models import Level, Lesson
    level = Level.objects.create(name="Test Level", level_order=1)
    lesson = Lesson.objects.create(title="Test Lesson", content="Test Content", level=level, level_order=1)
    api_client.force_authenticate(user=user)
    url = reverse('update_current_lesson')
    response = api_client.post(url, {'lesson_id': lesson.id})
    assert response.status_code == status.HTTP_200_OK
    user.refresh_from_db()
    assert user.current_lesson == lesson

@pytest.mark.django_db
def test_check_user(api_client, user):
    url = reverse('check_user')
    response = api_client.post(url, {'email': user.email, 'password': 'testpass123'})
    assert response.status_code == status.HTTP_200_OK
    assert response.data['user_exists'] == True
    assert response.data['is_active'] == True
    assert response.data['password_correct'] == True
    response = api_client.post(url, {'email': user.email, 'password': 'wrongpass'})
    assert response.status_code == status.HTTP_200_OK
    assert response.data['user_exists'] == True
    assert response.data['is_active'] == True
    assert response.data['password_correct'] == False
    response = api_client.post(url, {'email': 'nonexistent@example.com', 'password': 'testpass123'})
    assert response.status_code == status.HTTP_200_OK
    assert response.data['user_exists'] == False

@pytest.mark.django_db
def test_ensure_schema():
    with patch('django.db.connection.cursor') as mock_cursor:
        mock_cursor_instance = MagicMock()
        mock_cursor.return_value.__enter__.return_value = mock_cursor_instance
        mock_cursor_instance.fetchone.side_effect = [(True,), (False,), (True,), (False,)]
        ensure_schema()
        assert mock_cursor_instance.execute.call_count > 0

@pytest.mark.django_db
def test_ensure_schema_error_handling():
    with patch('django.db.connection.cursor') as mock_cursor:
        mock_cursor_instance = MagicMock()
        mock_cursor.return_value.__enter__.return_value = mock_cursor_instance
        mock_cursor_instance.execute.side_effect = Exception("Test error")
        ensure_schema()
        assert True

@pytest.mark.django_db
def test_send_password_reset_email():
    email = 'test@example.com'
    reset_url = 'http://example.com/reset'
    with patch('accounts.tasks.send_mail') as mock_send_mail:
        send_password_reset_email(email, reset_url)
        mock_send_mail.assert_called_once()
        call_args = mock_send_mail.call_args[0]
        assert call_args[0] == 'Password Reset'
        assert 'Please click the link to reset your password' in call_args[1]
        assert call_args[3] == [email]

@pytest.mark.django_db
def test_is_owner_or_readonly_permission(user):
    permission = IsOwnerOrReadOnly()
    factory = APIRequestFactory()
    class DummyObject:
        user = None
    obj = DummyObject()
    obj.user = user
    request = factory.get('/')
    assert permission.has_object_permission(request, None, obj) == True
    request = factory.post('/')
    request.user = user
    assert permission.has_object_permission(request, None, obj) == True
    other_user = User.objects.create_user(username='otheruser', email='otheruser@example.com', password='testpass')
    request.user = other_user
    assert permission.has_object_permission(request, None, obj) == False

@pytest.mark.django_db
def test_custom_exception_handler():
    exc = APIException("Test exception")
    context = {}
    response = custom_exception_handler(exc, context)
    assert response is not None
    assert 'status_code' in response.data
    assert response.data['status_code'] == response.status_code
    exc = ValueError("Test exception")
    context = {}
    response = custom_exception_handler(exc, context)
    assert response is None
