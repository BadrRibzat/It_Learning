from typing import Dict
from pymongo import MongoClient
from bson import ObjectId
from utils.redis_cache import cache
from utils.db import get_db
from config import config

class ProgressService:
    def __init__(self):
        self.db = get_db()

    def serialize_mongodb_object(obj):
        if isinstance(obj, dict):
            return {k: serialize_mongodb_object(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [serialize_mongodb_object(item) for item in obj]
        elif isinstance(obj, ObjectId):
            return str(obj)
        return obj
    
    def track_flashcard_progress(self, user_id: str, lesson_id: str, flashcard_id: str, is_correct: bool):
        """Update user progress for flashcards"""
        self.db.lessons_progress.update_one(
            {'user': ObjectId(user_id), 'lesson': ObjectId(lesson_id)},
            {
                '$set': {'last_flashcard': ObjectId(flashcard_id)},
                '$inc': {'correct_answers': 1} if is_correct else {'incorrect_answers': 1}
            },
            upsert=True
        )
        
        if self._should_unlock_quiz(user_id, lesson_id):
            self._create_quiz_entry(user_id, lesson_id)

    @cache(ttl=1800)
    def get_lesson_progress(self, user_id: str, lesson_id: str) -> Dict:
        """Get detailed progress for a lesson"""
        progress = self.db.lessons_progress.find_one({
            'user': ObjectId(user_id),
            'lesson': ObjectId(lesson_id)
        })
        
        if not progress:
            return {
                'completed_flashcards': 0,
                'total_flashcards': 10,
                'quiz_unlocked': False
            }
            
        # Find the quiz for this lesson
        quiz = self.db.quizzes.find_one({'lesson': ObjectId(lesson_id)})
        if not quiz:
            return {
                'completed_flashcards': progress.get('correct_answers', 0),
                'total_flashcards': 10,
                'quiz_unlocked': False
            }

        # Check if user has access to the quiz
        quiz_entry = self.db.users.find_one({
            '_id': ObjectId(user_id),
            'available_quizzes': {'$in': [quiz['_id']]}
        })

        return {
            'completed_flashcards': progress.get('correct_answers', 0),
            'total_flashcards': 10,
            'quiz_unlocked': bool(quiz_entry)
        }

    def _create_quiz_entry(self, user_id: str, lesson_id: str):
        quiz = self.db.quizzes.find_one({'lesson': ObjectId(lesson_id)})
        if quiz:  # Only update if quiz exists
            self.db.users.update_one(
                {'_id': ObjectId(user_id)},
                {'$addToSet': {'available_quizzes': quiz['_id']}},
                upsert=True
            )

    def _should_unlock_quiz(self, user_id: str, lesson_id: str) -> bool:
        progress = self.get_lesson_progress(user_id, lesson_id)
        return progress['completed_flashcards'] >= 10
