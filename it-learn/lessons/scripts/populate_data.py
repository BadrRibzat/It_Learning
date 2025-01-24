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

def generate_ml_content(prompt: str) -> str:
    """Generate content using spaCy NLP."""
    nlp = spacy.load(config.ML_MODEL_PATH)
    doc = nlp(prompt)
    return " ".join([sent.text for sent in doc.sents])

def generate_lesson_content(db, ml: MLContentService, command_list: list):
    """Generate flashcards and quizzes using ML."""
    # Generate flashcards with ML
    for command in command_list:
        content = ml.generate_flashcard_content(command)
        db.flashcards.insert_one({
            'command': command,
            **content,
            'formatted_example': content['example'].replace(
                command,
                f'<strong style="color:red">{command}</strong>'
            )
        })

    # Generate quizzes with ML
    flashcards = db.flashcards.find()
    for flashcard in flashcards:
        question = ml.generate_quiz_question(flashcard['command'])
        db.questions.insert_one({
            'type': 'fill_blank',
            'question': question['question'],
            'answer': question['answer'],
            'options': question['distractors']
        })

def populate_initial_data():
    """Populate the database with initial data."""
    try:
        client = MongoClient(config.MONGODB_URI)
        db = client['e-learn']
        nlp = spacy.load(config.ML_MODEL_PATH)
        ml = MLContentService()

        logging.info("Clearing existing data...")
        collections = ['levels', 'lessons', 'flashcards', 'quizzes', 'questions',
                      'level_tests', 'level_test_questions', 'quiz_submissions']
        for col in collections:
            db[col].delete_many({})

        logging.info("Creating levels...")
        levels = [
            {'name': 'beginner', 'order': 1, 'created_at': datetime.utcnow()},
            {'name': 'intermediate', 'order': 2, 'created_at': datetime.utcnow()},
            {'name': 'advanced', 'order': 3, 'created_at': datetime.utcnow()},
            {'name': 'expert', 'order': 4, 'created_at': datetime.utcnow()}
        ]
        level_ids = [db.levels.insert_one(level).inserted_id for level in levels]

        logging.info("Creating lessons and content...")
        command_examples = [
            'ls', 'cd', 'mkdir', 'rmdir', 'touch', 'cp', 'mv', 'rm', 'cat', 'echo',
            'grep', 'find', 'head', 'tail', 'chmod', 'chown', 'ps', 'kill', 'df', 'du',
            'top', 'history', 'alias', 'unalias', 'export', 'source', 'wget', 'curl', 'tar', 'ssh', 'sudo'
        ]

        for level_id in level_ids:
            for lesson_num in range(1, 6):
                lesson = {
                    'level': level_id,
                    'title': f'Lesson {lesson_num} for {db.levels.find_one({"_id": level_id})["name"]}',
                    'order': lesson_num,
                    'created_at': datetime.utcnow()
                }
                lesson_id = db.lessons.insert_one(lesson).inserted_id

                # Create flashcards
                for i in range(10):
                    cmd = random.choice(command_examples)
                    doc = nlp(f"Explain the {cmd} command for Linux/macOS with example")
                    flashcard = {
                        'lesson': lesson_id,
                        'command': cmd,
                        'explanation': " ".join([sent.text for sent in doc.sents]),
                        'example': f"Example usage of {cmd}",
                        'question': f"What does the {cmd} command do?",
                        'answer': cmd,
                        'order': i + 1,
                        'created_at': datetime.utcnow()
                    }
                    db.flashcards.insert_one(flashcard)

                # Create quiz
                quiz_id = db.quizzes.insert_one({
                    'lesson': lesson_id,
                    'level': level_id,
                    'created_at': datetime.utcnow()
                }).inserted_id

                # Create quiz questions
                flashcards = list(db.flashcards.find({'lesson': lesson_id}))
                for j in range(5):
                    if flashcards:
                        flashcard = random.choice(flashcards)
                        db.questions.insert_one({
                            'quiz': quiz_id,
                            'question': f'What is the purpose of {flashcard["command"]}?',
                            'answer': flashcard["command"],
                            'order': j + 1,
                            'created_at': datetime.utcnow()
                        })

        logging.info("Creating level tests...")
        for level in db.levels.find():
            if level['name'] != 'beginner':
                test_id = db.level_tests.insert_one({
                    'level': level['_id'],
                    'created_at': datetime.utcnow()
                }).inserted_id

                # Add test questions
                prev_level = db.levels.find_one({'order': level['order'] - 1})
                quizzes = list(db.quizzes.find({'level': prev_level['_id']}))
                questions = []
                for quiz in quizzes:
                    questions.extend(list(db.questions.find({'quiz': quiz['_id']})))

                random.shuffle(questions)
                for k, question in enumerate(questions[:10]):
                    db.level_test_questions.insert_one({
                        'level_test': test_id,
                        'question': question['question'],
                        'answer': question['answer'],
                        'order': k + 1,
                        'created_at': datetime.utcnow()
                    })

        logging.info("Creating admin user...")
        if not db.users.find_one({'email': 'admin@admin.com'}):
            db.users.insert_one({
                'email': 'admin@admin.com',
                'password': generate_password_hash('admin'),
                'full_name': 'Admin',
                'is_staff': True,
                'is_active': True,
                'created_at': datetime.utcnow()
            })

        client.close()
        logging.info("Data population completed successfully!")

    except Exception as e:
        logging.error(f"Error during data population: {e}")
        raise

if __name__ == '__main__':
    populate_initial_data()
