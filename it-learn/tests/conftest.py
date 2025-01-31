import pytest
import os
import httpx
import uuid
import json
from mongomock import MongoClient
import asyncio
from asgiref.wsgi import WsgiToAsgi
from httpx import AsyncClient
from utils.db import Database
from pathlib import Path
import fakeredis
from unittest.mock import patch

@pytest.fixture(autouse=True)
def mock_redis():
    """Mock Redis for testing"""
    fake_redis = fakeredis.FakeStrictRedis()
    with patch('utils.redis_cache.get_redis_client', return_value=fake_redis):
        yield fake_redis

TEST_PASSWORD = "Testpassword1!"
TEST_USER_DATA = {
    "password": TEST_PASSWORD,
    "confirm_password": TEST_PASSWORD,
    "full_name": "Test User",
    "date_of_birth": "1990-01-01",
    "current_language": "en"
}

@pytest.fixture(scope="session", autouse=True)
def setup_test_env():
    """Setup test environment variables"""
    os.environ['TESTING'] = 'true'
    os.environ['SECRET_KEY'] = 'test_secret_key'
    os.environ['DEBUG'] = 'true'
    yield
    os.environ.pop('TESTING', None)

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="function")
def mock_db():
    """Provide a mock database for testing"""
    from mongomock import MongoClient
    client = MongoClient()
    db = client.test_db

    # Create collections with indexes
    db.create_collection('lessons')
    db.lessons.create_index([('level', 1)])

    db.create_collection('flashcards')
    db.flashcards.create_index([('lesson', 1)])

    db.create_collection('questions')
    db.questions.create_index([('quiz', 1)])

    # Create other required collections
    collections = [
        'users', 'profiles', 'revoked_tokens', 'points_history',
        'achievements', 'user_activity', 'lessons_progress',
        'levels', 'quizzes', 'level_tests', 'level_test_questions', 
        'quiz_submissions', 'available_quizzes'
    ]
    
    for collection in collections:
        if collection not in db.list_collection_names():
            db.create_collection(collection)

    def get_mock_db():
        return db

    with patch('utils.db.get_db', get_mock_db):
        yield db

@pytest.fixture
def flask_app(mock_db):
    """Create Flask application instance"""
    from run import create_app
    app = create_app()
    
    # Ensure the app uses the mock database
    with patch('utils.db.get_db', return_value=mock_db):
        yield app

@pytest.fixture
def app(flask_app):
    """Create ASGI application"""
    return WsgiToAsgi(flask_app)

@pytest.fixture
async def client(app):
    """Create async test client"""
    async with AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://test"
    ) as client:
        yield client

@pytest.fixture
def unique_email():
    """Generate unique test email"""
    return f"test_{uuid.uuid4()}@example.com"

@pytest.fixture
async def authenticated_user(client, unique_email):
    """Create and authenticate a test user"""
    # Register user
    register_response = await client.post(
        "/auth/register",
        json={
            "email": unique_email,
            **TEST_USER_DATA
        }
    )
    assert register_response.status_code == 200
    user_id = register_response.json()["user"]["id"]

    # Login user
    login_response = await client.post(
        "/auth/login",
        json={
            "email": unique_email,
            "password": TEST_PASSWORD
        }
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    return {
        "user_id": user_id,
        "email": unique_email,
        "token": token
    }

@pytest.fixture(autouse=True)
def cleanup_db(mock_db):
    """Cleanup database after each test"""
    yield
    for collection in mock_db.list_collection_names():
        if collection != 'system.indexes':
            mock_db[collection].delete_many({})

@pytest.fixture(autouse=True)
def setup_logging():
    """Configure logging for tests"""
    import logging
    logging.basicConfig(
        level=logging.DEBUG,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

@pytest.fixture(autouse=True)
def setup_upload_dir():
    """Ensure upload directory exists for tests"""
    upload_dir = Path('uploads/profile_pictures/test')
    upload_dir.mkdir(parents=True, exist_ok=True)
    yield
    # Clean up test files after tests
    for file in upload_dir.glob('*'):
        if file.is_file() and file.name != '.gitkeep':
            file.unlink()
