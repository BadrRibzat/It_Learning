import pytest
from httpx import AsyncClient, ASGITransport
from run import create_app
import json
from bson import ObjectId
import random
from httpx import ASGITransport
from asgiref.wsgi import WsgiToAsgi
from utils.db import get_db
from datetime import datetime

@pytest.fixture(scope="module")
def app():
    flask_app = create_app()
    return WsgiToAsgi(flask_app)

@pytest.fixture(scope="function")
async def client(app):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client
        # Cleanup after test
        db = get_db()
        db.users.delete_many({})
        db.lessons_progress.delete_many({})
        db.lessons.delete_many({})
        db.quizzes.delete_many({})
        db.levels.delete_many({})

@pytest.fixture(scope="function")
async def auth_setup(client):
    """Setup authenticated user and required data"""
    # Create test level
    db = get_db()
    level = db.levels.insert_one({
        'name': 'beginner',
        'order': 1,
        'created_at': datetime.utcnow()
    })

    # Register user
    register_response = await client.post(
        "/auth/register",
        json={
            "email": "testlessons@example.com",
            "password": "Testpassword1!",
            "confirm_password": "Testpassword1!",
            "full_name": "Test User",
            "current_language": "en"
        }
    )

    # Login user
    login_response = await client.post(
        "/auth/login",
        json={
            "email": "testlessons@example.com",
            "password": "Testpassword1!"
        }
    )
    
    access_token = login_response.json()["access_token"]
    user_id = register_response.json()["user"]["id"]
    
    return {
        "access_token": access_token,
        "user_id": user_id,
        "level_id": str(level.inserted_id)
    }

@pytest.fixture(scope="function")
async def setup_test_data(client, auth_setup):
    """Setup lesson and quiz data"""
    db = get_db()
    
    # Create a test lesson
    lesson_id = ObjectId("67936bf031cc3b19056e5279")
    db.lessons.insert_one({
        "_id": lesson_id,
        "title": "Test Lesson",
        "order": 1,
        "level": ObjectId(auth_setup["level_id"])
    })

    # Create a test quiz
    quiz_id = ObjectId()
    db.quizzes.insert_one({
        "_id": quiz_id,
        "lesson": lesson_id,
        "title": "Test Quiz"
    })

    yield {
        "lesson_id": str(lesson_id),
        "quiz_id": str(quiz_id)
    }

@pytest.fixture(scope="function")
def mock_lesson_id():
    return "67936bf031cc3b19056e5279"

@pytest.fixture(scope="function")
def mock_object_id():
    return str(ObjectId())

@pytest.mark.asyncio
async def test_get_level_progression_success(client, auth_setup):
    response = await client.get(
        "/lessons/levels/progression",
        headers={"Authorization": f"Bearer {auth_setup['access_token']}"}
    )
    assert response.status_code == 200
    assert "current_level" in response.json()
    assert "next_level" in response.json()
    assert "unlocked_levels" in response.json()

@pytest.mark.asyncio
async def test_get_level_progression_fail_unauthorized(client):
    response = await client.get("/lessons/levels/progression")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_submit_flashcard_answer_success(client, auth_setup, setup_test_data, mock_object_id):
    response = await client.post(
        f"/lessons/flashcards/{setup_test_data['lesson_id']}/submit",
        headers={"Authorization": f"Bearer {auth_setup['access_token']}"},
        json={
            "flashcard_id": mock_object_id,
            "user_answer": "ls",
            "expected_answer": "ls"
        }
    )
    assert response.status_code == 200
    assert "correct" in response.json()
    assert "progress" in response.json()
    assert "quiz_unlocked" in response.json()

@pytest.mark.asyncio
async def test_submit_flashcard_answer_incorrect(client, auth_setup, setup_test_data, mock_object_id):
    response = await client.post(
        f"/lessons/flashcards/{setup_test_data['lesson_id']}/submit",
        headers={"Authorization": f"Bearer {auth_setup['access_token']}"},
        json={
            "flashcard_id": mock_object_id,
            "user_answer": "incorrect_answer",
            "expected_answer": "ls"
        }
    )
    assert response.status_code == 200
    assert "correct" in response.json()
    assert "progress" in response.json()
    assert "quiz_unlocked" in response.json()
    assert response.json()["correct"] is False

@pytest.mark.asyncio
async def test_submit_flashcard_answer_fail_unauthorized(client, setup_test_data):
    response = await client.post(
        f"/lessons/flashcards/{setup_test_data['lesson_id']}/submit",
        json={
            "flashcard_id": str(ObjectId()),
            "user_answer": "some_answer",
            "expected_answer": "some_answer"
        }
    )
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_submit_flashcard_answer_fail_missing_fields(client, auth_setup, setup_test_data, mock_object_id):
    response = await client.post(
        f"/lessons/flashcards/{setup_test_data['lesson_id']}/submit",
        headers={"Authorization": f"Bearer {auth_setup['access_token']}"},
        json={
            "flashcard_id": mock_object_id,
            "user_answer": "some_answer"
        }
    )
    assert response.status_code == 400
    assert "error" in response.json()
