import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

import random
from datetime import datetime
import spacy
from werkzeug.security import generate_password_hash
import logging
from config import config
from services.ml_service import MLContentService
from utils.db import get_db

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def populate_initial_data():
    try:
        db = get_db()

        # Clear existing data
        logging.info("Clearing existing data...")
        collections = [
            'levels', 'lessons', 'flashcards', 'quizzes', 'questions',
            'level_tests', 'level_test_questions', 'quiz_submissions', 'users', 'lessons_progress'
        ]
        for col in collections:
            db[col].delete_many({})
        logging.info("Database cleaned successfully.")

        # Initialize ML service
        nlp = spacy.load(config.ML_MODEL_PATH)
        ml = MLContentService()

        # Define levels
        levels = [
            {"name": "beginner", "order": 1},
            {"name": "intermediate", "order": 2},
            {"name": "advanced", "order": 3},
            {"name": "expert", "order": 4}
        ]

        # Command details (expanded for more content)
        command_examples = {
            "beginner": ["echo", "grep", "find"],
            "intermediate": ["chmod", "chown", "ps", "kill", "df"],
            "advanced": ["du", "top", "history", "alias", "export"],
            "expert": ["source", "wget", "curl", "tar", "ssh", "sudo", "dd", "netstat", "ping", "traceroute", "ifconfig", "nmcli"]
        }

        # Create levels
        level_ids = []
        for level in levels:
            level_doc = {
                "name": level["name"],
                "order": level["order"],
                "created_at": datetime.utcnow()
            }
            level_id = db.levels.insert_one(level_doc).inserted_id
            level_ids.append(level_id)
            logger.info(f"Created level: {level['name']} with ID: {level_id}")

        # Create lessons, flashcards, and quizzes for each level
        for level_id, level_info in zip(level_ids, levels):
            level_name = level_info["name"]
            logger.info(f"Creating lessons for level: {level_name} (ID: {level_id})")

            for lesson_num in range(1, 6):  # 5 lessons per level
                lesson = {
                    "level": level_id,
                    "title": f"Lesson {lesson_num} for {level_name}",
                    "description": "",
                    "order": lesson_num,
                    "created_at": datetime.utcnow()
                }
                lesson_id = db.lessons.insert_one(lesson).inserted_id
                logger.info(f"Created lesson {lesson_num} with ID: {lesson_id}")

                # Create flashcards
                for i, cmd in enumerate(command_examples[level_name]):
                    ml_content = ml.generate_flashcard_content(cmd)  # Use ML service

                    flashcard = {
                        "lesson": lesson_id,
                        "command": cmd,
                        "explanation": ml_content.get('purpose', f"The {cmd} command is used in Linux/macOS."),
                        "example": ml_content.get('example', f"Example usage of {cmd}: {cmd} [options]"),
                        "formatted_example": ml_content.get('example', f"```sh\n{cmd} [options]\n```"),
                        "question": f"What is the purpose of the {cmd} command?",
                        "answer": ml_content.get('purpose', f"The {cmd} command is used in Linux/macOS."),
                        "order": i + 1,
                        "created_at": datetime.utcnow()
                    }
                    flashcard_id = db.flashcards.insert_one(flashcard).inserted_id
                    logger.info(f"Created flashcard for {cmd} with ID: {flashcard_id}")

                # Create quiz
                quiz = {
                    "lesson": lesson_id,
                    "passing_score": 0.8,
                    "created_at": datetime.utcnow()
                }
                quiz_id = db.quizzes.insert_one(quiz).inserted_id
                logger.info(f"Created quiz with ID: {quiz_id}")

                # Create quiz questions with wrong answers
                flashcards = list(db.flashcards.find({"lesson": lesson_id}))
                for j in range(5):  # 5 questions per quiz
                    if flashcards:
                        flashcard = flashcards[j % len(flashcards)]
                        ml_question = ml.generate_quiz_question(flashcard['command'])  # Use ML service

                        question = {
                            "quiz": quiz_id,
                            "type": "fill_blank",
                            "question": ml_question.get('question', f"What is the purpose of {flashcard['command']}?"),
                            "answer": ml_question.get('answer', flashcard['command']),
                            "distractors": ml_question.get('distractors', generate_wrong_answers(flashcard['command'])),
                            "order": j + 1,
                            "created_at": datetime.utcnow()
                        }
                        question_id = db.questions.insert_one(question).inserted_id
                        logger.info(f"Created quiz question with ID: {question_id}")

        # Create test users
        logging.info("Creating test users...")
        test_user = {
            "email": "test@example.com",
            "password": generate_password_hash("Test123!"),
            "full_name": "Test User",
            "is_staff": False,
            "is_active": True,
            "total_points": 0,
            "created_at": datetime.utcnow()
        }
        if not db.users.find_one({"email": "test@example.com"}):
            user_id = db.users.insert_one(test_user).inserted_id
            logger.info(f"Created test user with ID: {user_id}")

        admin_user = {
            "email": "admin@admin.com",
            "password": generate_password_hash("admin"),
            "full_name": "Admin",
            "is_staff": True,
            "is_active": True,
            "created_at": datetime.utcnow()
        }
        if not db.users.find_one({"email": "admin@admin.com"}):
            admin_id = db.users.insert_one(admin_user).inserted_id
            logger.info(f"Created admin user with ID: {admin_id}")

        logging.info("Data population completed successfully!")

    except Exception as e:
        logger.error(f"Error during data population: {str(e)}")
        raise

def generate_wrong_answers(correct_answer: str) -> list:
    """Generates plausible wrong answers for a given correct answer."""
    wrong_answers = []

    # Generate variations of the correct answer
    if isinstance(correct_answer, str):
        wrong_answers.extend([
            correct_answer.lower(),  # Lowercase version
            correct_answer.upper(),  # Uppercase version
            correct_answer.capitalize(),  # Capitalized version
            correct_answer.replace(" ", "_"),  # Replace spaces with underscores
            correct_answer[::-1][:len(correct_answer) // 2]  # Reversed partial string
        ])

    # Add unrelated but plausible commands
    unrelated_commands = ["cat", "ls", "pwd", "rm", "mv", "cp", "mkdir", "rmdir", "touch"]
    wrong_answers.extend([cmd for cmd in unrelated_commands if cmd != correct_answer])

    # Ensure uniqueness and limit to 3-5 wrong answers
    wrong_answers = list(set(wrong_answers))
    random.shuffle(wrong_answers)
    return wrong_answers[:random.randint(3, 5)]

def get_db():
    """Get database instance from utils.db."""
    from utils.db import get_db
    return get_db()

if __name__ == "__main__":
    populate_initial_data()
