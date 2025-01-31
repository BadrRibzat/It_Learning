import pytest
from httpx import AsyncClient
import uuid
import logging
from bson import ObjectId

logger = logging.getLogger(__name__)

# Test data
TEST_PASSWORD = "Testpassword1!"
TEST_USER_DATA = {
    "password": TEST_PASSWORD,
    "confirm_password": TEST_PASSWORD,
    "full_name": "Test User",
    "date_of_birth": "1990-01-01",
    "current_language": "en"
}

@pytest.fixture
async def setup_levels_and_lessons(mock_db, authenticated_user):
    """Fixture to create a test level, lesson, flashcard, quiz, and level test."""
    
    # Create level
    level = {'name': 'beginner', 'order': 1}
    level_result = mock_db.levels.insert_one(level)
    level_id = str(level_result.inserted_id)

    # Create lesson for beginner
    lesson = {'title': 'Test Lesson', 'level': ObjectId(level_id), 'order': 1, 'description': 'Test Description'}
    lesson_result = mock_db.lessons.insert_one(lesson)
    lesson_id = str(lesson_result.inserted_id)

    # Create flashcard for the lesson
    flashcard = {'command': 'test_cmd', 'explanation': 'Test explanation', 'example': 'Test example', 'question': 'Test question', 'answer': 'test_answer', 'lesson': ObjectId(lesson_id), 'order': 1}
    flashcard_result = mock_db.flashcards.insert_one(flashcard)
    flashcard_id = str(flashcard_result.inserted_id)

    # Create quiz for the lesson
    quiz = {'lesson': ObjectId(lesson_id), 'passing_score': 0.8}
    quiz_result = mock_db.quizzes.insert_one(quiz)
    quiz_id = str(quiz_result.inserted_id)

    # Create questions for quiz
    question = {'type': 'fill_blank', 'question': 'What is it?', 'answer': 'test_answer', 'quiz': ObjectId(quiz_id), 'order': 1}
    mock_db.questions.insert_one(question)

    # Create level test
    level_test = {'level': ObjectId(level_id), 'passing_score': 0.8}
    test_result = mock_db.level_tests.insert_one(level_test)
    test_id = str(test_result.inserted_id)

    # Create level test questions
    test_question = {'type': 'fill_blank', 'question': 'What is it?', 'answer': 'test_answer', 'level_test': ObjectId(test_id), 'order': 1}
    mock_db.level_test_questions.insert_one(test_question)

        # Set beginner level as current level for the user
    mock_db.users.update_one(
        {'_id': ObjectId(authenticated_user['user_id'])},
        {'$set': {'current_level': 1}}
    )
    user = mock_db.users.find_one({'_id': ObjectId(authenticated_user['user_id'])})
    logger.info(f"User data: {user}")
    
    # Get current level, for debug purposes
    current_level_order = user.get('current_level', 1) if user else 1
    logger.info(f"current_level_order: {current_level_order}")
    logger.info(f"levels in database: {list(mock_db.levels.find())}")

    return {
        'level_id': level_id,
        'lesson_id': lesson_id,
        'flashcard_id': flashcard_id,
        'quiz_id': quiz_id,
        'test_id': test_id
    }


@pytest.mark.asyncio
class TestLessons:
    async def test_get_all_levels(self, client, authenticated_user):
        """Test getting all available levels"""
        response = await client.get(
            "/lessons/levels",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"}
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    async def test_get_current_level(self, client, authenticated_user):
        """Test getting current level details"""
        response = await client.get(
            "/lessons/levels/current",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"}
        )
        assert response.status_code == 200
        assert "lessons" in response.json()

    async def test_get_lessons_for_level(self, client, authenticated_user, setup_levels_and_lessons):
        """Test getting lessons for a level"""
        response = await client.get(
            f"/lessons/levels/{setup_levels_and_lessons['level_id']}/lessons",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"}
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    async def test_get_flashcards_for_lesson(self, client, authenticated_user, setup_levels_and_lessons):
        """Test getting flashcards for a lesson"""
        response = await client.get(
            f"/lessons/lessons/{setup_levels_and_lessons['lesson_id']}/flashcards",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"}
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    async def test_submit_flashcard_answer(self, client, authenticated_user, setup_levels_and_lessons):
         """Test submitting a correct flashcard answer"""
         response = await client.post(
            f"/lessons/flashcards/{setup_levels_and_lessons['lesson_id']}/submit",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"},
            json={"flashcard_id": setup_levels_and_lessons['flashcard_id'], "user_answer": "test_answer", "expected_answer": "test_answer"}
         )
         assert response.status_code == 200
         assert response.json()["correct"] == True

    async def test_get_lesson_quiz_not_unlocked(self, client, authenticated_user, setup_levels_and_lessons):
        """Test retrieving a quiz that is not yet unlocked"""
        response = await client.get(
            f"/lessons/lessons/{setup_levels_and_lessons['lesson_id']}/quiz",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"}
        )
        assert response.status_code == 403

    async def test_get_lesson_quiz_unlocked(self, client, authenticated_user, setup_levels_and_lessons):
        """Test retrieving a quiz that is unlocked after flashcards submission"""
        await client.post(
            f"/lessons/flashcards/{setup_levels_and_lessons['lesson_id']}/submit",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"},
            json={"flashcard_id": setup_levels_and_lessons['flashcard_id'], "user_answer": "test_answer", "expected_answer": "test_answer"}
        )
        response = await client.get(
            f"/lessons/lessons/{setup_levels_and_lessons['lesson_id']}/quiz",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"}
        )
        assert response.status_code == 200
        assert "questions" in response.json()

    async def test_submit_quiz_answers_correctly(self, client, authenticated_user, setup_levels_and_lessons):
        """Test submitting correct quiz answers"""
        await client.post(
           f"/lessons/flashcards/{setup_levels_and_lessons['lesson_id']}/submit",
           headers={"Authorization": f"Bearer {authenticated_user['token']}"},
           json={"flashcard_id": setup_levels_and_lessons['flashcard_id'], "user_answer": "test_answer", "expected_answer": "test_answer"}
        )
        response = await client.post(
            f"/lessons/lessons/{setup_levels_and_lessons['lesson_id']}/quiz",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"},
            json={"answers": ["test_answer"]}
        )
        assert response.status_code == 200
        assert response.json()["passed"] == True

    async def test_submit_quiz_answers_incorrectly(self, client, authenticated_user, setup_levels_and_lessons):
        """Test submitting incorrect quiz answers and not passing the quiz"""
        await client.post(
            f"/lessons/flashcards/{setup_levels_and_lessons['lesson_id']}/submit",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"},
            json={"flashcard_id": setup_levels_and_lessons['flashcard_id'], "user_answer": "test_answer", "expected_answer": "test_answer"}
        )
        response = await client.post(
            f"/lessons/lessons/{setup_levels_and_lessons['lesson_id']}/quiz",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"},
            json={"answers": ["wrong"]}
        )
        assert response.status_code == 200
        assert response.json()["passed"] == False

    async def test_get_level_test_not_eligible(self, client, authenticated_user, setup_levels_and_lessons):
         """Test accessing the level test before completing lessons and quizzes"""
         response = await client.get(
            f"/lessons/levels/{setup_levels_and_lessons['level_id']}/test",
              headers={"Authorization": f"Bearer {authenticated_user['token']}"}
         )
         assert response.status_code == 403

    async def test_get_level_test_eligible(self, client, authenticated_user, setup_levels_and_lessons):
        """Test accessing level test when eligible"""
        await client.post(
            f"/lessons/flashcards/{setup_levels_and_lessons['lesson_id']}/submit",
             headers={"Authorization": f"Bearer {authenticated_user['token']}"},
             json={"flashcard_id": setup_levels_and_lessons['flashcard_id'], "user_answer": "test_answer", "expected_answer": "test_answer"}
         )
        response = await client.post(
           f"/lessons/lessons/{setup_levels_and_lessons['lesson_id']}/quiz",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"},
             json={"answers": ["test_answer"]}
         )
        response = await client.get(
           f"/lessons/levels/{setup_levels_and_lessons['level_id']}/test",
             headers={"Authorization": f"Bearer {authenticated_user['token']}"}
         )
        assert response.status_code == 200
        assert "questions" in response.json()

    async def test_submit_level_test_answers_correctly(self, client, authenticated_user, setup_levels_and_lessons):
        """Test submitting correct level test answers"""
        await client.post(
            f"/lessons/flashcards/{setup_levels_and_lessons['lesson_id']}/submit",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"},
            json={"flashcard_id": setup_levels_and_lessons['flashcard_id'], "user_answer": "test_answer", "expected_answer": "test_answer"}
        )
        response = await client.post(
            f"/lessons/lessons/{setup_levels_and_lessons['lesson_id']}/quiz",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"},
            json={"answers": ["test_answer"]}
         )
        response = await client.post(
           f"/lessons/levels/{setup_levels_and_lessons['level_id']}/test",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"},
            json={"answers": ["test_answer"]}
        )
        assert response.status_code == 200
        assert response.json()["passed"] == True

    async def test_submit_level_test_answers_incorrectly(self, client, authenticated_user, setup_levels_and_lessons):
        """Test submitting incorrect level test answers and not passing"""
         # Submit required flashcards for lesson 1
        await client.post(
           f"/lessons/flashcards/{setup_levels_and_lessons['lesson_id']}/submit",
             headers={"Authorization": f"Bearer {authenticated_user['token']}"},
             json={"flashcard_id": setup_levels_and_lessons['flashcard_id'], "user_answer": "test_answer", "expected_answer": "test_answer"}
        )
        response = await client.post(
            f"/lessons/lessons/{setup_levels_and_lessons['lesson_id']}/quiz",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"},
            json={"answers": ["test_answer"]}
        )
    
        response = await client.post(
           f"/lessons/levels/{setup_levels_and_lessons['level_id']}/test",
             headers={"Authorization": f"Bearer {authenticated_user['token']}"},
            json={"answers": ["wrong"]}
        )
        assert response.status_code == 200
        assert response.json()["passed"] == False

    async def test_get_level_progress(self, client, authenticated_user, setup_levels_and_lessons):
        """Test getting the level progress"""
        response = await client.get(
            f"/lessons/progress/{setup_levels_and_lessons['level_id']}",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"}
        )
        assert response.status_code == 200
        assert "lessons_progress" in response.json()
