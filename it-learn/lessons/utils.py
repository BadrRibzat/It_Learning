from utils.db import get_db
from bson import ObjectId
import random

def calculate_lesson_progress(user_id, lesson_id):
    db = get_db()
    progress = db.lessons_progress.find_one({
        'user': ObjectId(user_id),
        'lesson': ObjectId(lesson_id)
    })
    return progress['last_completed_flashcard'] if progress else None

def generate_quiz_questions(lesson_id, num_questions=5):
    db = get_db()
    flashcards = list(db.flashcards.find({'lesson': ObjectId(lesson_id)}))
    return random.sample(flashcards, min(num_questions, len(flashcards)))

def check_level_unlock(user_id, target_level):
    db = get_db()
    user = db.users.find_one({'_id': ObjectId(user_id)})

    current_level = db.levels.find_one({'name': user['current_level']})
    target_level_data = db.levels.find_one({'name': target_level})

    if target_level_data['order'] <= current_level['order']:
        return True

    # Check if required test exists and passed
    test = db.level_tests.find_one({
        'required_level': current_level['_id'],
        'target_level': target_level_data['_id']
    })

    if not test:
        return False

    submission = db.level_test_submissions.find_one({
        'user': ObjectId(user_id),
        'level_test': test['_id'],
        'score': {'$gte': 0.8 * test['total_questions']}
    })

    return submission is not None
