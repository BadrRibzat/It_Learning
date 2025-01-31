import sys
import os

# project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

import random
from datetime import datetime
from pymongo import MongoClient
import spacy
from services.ml_service import MLContentService
from werkzeug.security import generate_password_hash
import logging
from config import config

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def populate_initial_data():
    """Populate the database with initial data."""
    try:
        client = MongoClient(config.MONGODB_URI)
        db = client['e-learn']
        nlp = spacy.load(config.ML_MODEL_PATH)
        ml = MLContentService()

        logging.info("Clearing existing data...")
        collections = ['levels', 'lessons', 'flashcards', 'quizzes', 'questions',
                      'level_tests', 'level_test_questions', 'quiz_submissions', 'users']
        for col in collections:
            db[col].delete_many({})

        logging.info("Creating levels...")
        levels = [
            {'name': 'beginner', 'order': 1, 'created_at': datetime.utcnow()},
            {'name': 'intermediate', 'order': 2, 'created_at': datetime.utcnow()},
            {'name': 'advanced', 'order': 3, 'created_at': datetime.utcnow()},
            {'name': 'expert', 'order': 4, 'created_at': datetime.utcnow()}
        ]
        level_ids = []
        for level in levels:
            level_id = db.levels.insert_one(level).inserted_id
            level_ids.append(level_id)
            logger.info(f"Created level: {level['name']} with ID: {level_id}")

        logging.info("Creating lessons and content...")
        command_examples = [
            'ls', 'cd', 'mkdir', 'rmdir', 'touch', 'cp', 'mv', 'rm', 'cat', 'echo',
            'grep', 'find', 'head', 'tail', 'chmod', 'chown', 'ps', 'kill', 'df', 'du',
            'top', 'history', 'alias', 'unalias', 'export', 'source', 'wget', 'curl', 'tar', 'ssh', 'sudo'
        ]

        for level_id in level_ids:
            level_info = db.levels.find_one({"_id": level_id})
            logger.info(f"Creating lessons for level: {level_info['name']} (ID: {level_id})")
            
            for lesson_num in range(1, 6):
                lesson = {
                    'level': level_id,
                    'title': f"Lesson {lesson_num} for {level_info['name']}",
                    'description': '',
                    'order': lesson_num,
                    'created_at': datetime.utcnow()
                }
                lesson_id = db.lessons.insert_one(lesson).inserted_id
                logger.info(f"Created lesson {lesson_num} with ID: {lesson_id}")

                # Create flashcards
                for i in range(10):
                    cmd = random.choice(command_examples)
                    doc = nlp(f"Explain the {cmd} command for Linux/macOS with example")
                    flashcard = {
                        'lesson': lesson_id,
                        'command': cmd,
                        'explanation': f"Explain the {cmd} command for Linux/macOS with example",
                        'example': f"Example usage of {cmd}",
                        'formatted_example': f"Example usage of {cmd}",
                        'question': f"What does the {cmd} command do?",
                        'answer': cmd,
                        'order': i + 1,
                        'created_at': datetime.utcnow()
                    }
                    flashcard_id = db.flashcards.insert_one(flashcard).inserted_id
                    logger.info(f"Created flashcard for {cmd} with ID: {flashcard_id}")

                # Create quiz
                quiz = {
                    'lesson': lesson_id,
                    'level': level_id,
                    'passing_score': 0.8,
                    'created_at': datetime.utcnow()
                }
                quiz_id = db.quizzes.insert_one(quiz).inserted_id
                logger.info(f"Created quiz with ID: {quiz_id}")

                # Create quiz questions
                flashcards = list(db.flashcards.find({'lesson': lesson_id}))
                for j in range(5):
                    if flashcards:
                        flashcard = random.choice(flashcards)
                        question = {
                            'quiz': quiz_id,
                            'type': 'fill_blank',
                            'question': f'What is the purpose of {flashcard["command"]}?',
                            'answer': flashcard["command"],
                            'order': j + 1,
                            'created_at': datetime.utcnow()
                        }
                        question_id = db.questions.insert_one(question).inserted_id
                        logger.info(f"Created quiz question with ID: {question_id}")

        logging.info("Creating level tests...")
        for level in db.levels.find():
            if level['name'] != 'beginner':
                test = {
                    'level': level['_id'],
                    'passing_score': 0.8,
                    'created_at': datetime.utcnow()
                }
                test_id = db.level_tests.insert_one(test).inserted_id
                logger.info(f"Created level test for {level['name']} with ID: {test_id}")

                # Add test questions
                prev_level = db.levels.find_one({'order': level['order'] - 1})
                quizzes = list(db.quizzes.find({'level': prev_level['_id']}))
                questions = []
                for quiz in quizzes:
                    questions.extend(list(db.questions.find({'quiz': quiz['_id']})))

                random.shuffle(questions)
                for k, question in enumerate(questions[:10]):
                    test_question = {
                        'level_test': test_id,
                        'type': 'fill_blank',
                        'question': question['question'],
                        'answer': question['answer'],
                        'order': k + 1,
                        'created_at': datetime.utcnow()
                    }
                    test_question_id = db.level_test_questions.insert_one(test_question).inserted_id
                    logger.info(f"Created level test question with ID: {test_question_id}")

        logging.info("Creating test user...")
        test_user = {
            'email': 'test@example.com',
            'password': generate_password_hash('Test123!'),
            'full_name': 'Test User',
            'is_staff': False,
            'is_active': True,
            'current_level': 1,
            'total_points': 0,
            'created_at': datetime.utcnow()
        }
        user_id = db.users.insert_one(test_user).inserted_id
        logger.info(f"Created test user with ID: {user_id}")

        logging.info("Creating admin user...")
        if not db.users.find_one({'email': 'admin@admin.com'}):
            admin_user = {
                'email': 'admin@admin.com',
                'password': generate_password_hash('admin'),
                'full_name': 'Admin',
                'is_staff': True,
                'is_active': True,
                'created_at': datetime.utcnow()
            }
            admin_id = db.users.insert_one(admin_user).inserted_id
            logger.info(f"Created admin user with ID: {admin_id}")

        client.close()
        logging.info("Data population completed successfully!")

    except Exception as e:
        logging.error(f"Error during data population: {e}")
        raise

if __name__ == '__main__':
    populate_initial_data()
