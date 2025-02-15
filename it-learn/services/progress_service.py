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

    def track_lesson_progress(self, user_id: str, lesson_id: str, is_completed: bool):
        """Update user progress for lessons"""
        # Track lesson completion with 10 points per lesson
        self.db.lessons_progress.update_one(
            {'user': ObjectId(user_id), 'lesson': ObjectId(lesson_id)},
            {
                '$set': {
                    'last_lesson': ObjectId(lesson_id),
                    'completed': is_completed
                },
                '$inc': {'points': 10 if is_completed else 0}
            },
            upsert=True
        )

    @cache(ttl=1800)  
    def get_lesson_progress(self, user_id: str, lesson_id: str) -> Dict:
        """Get detailed progress for a lesson"""
        progress = self.db.lessons_progress.find_one({
            'user': ObjectId(user_id),
            'lesson': ObjectId(lesson_id)
        })
        
        return {
            'completed': progress.get('completed', False),
            'points': progress.get('points', 0),
            'total_points': 10  # Each lesson is worth 10 points when completed
        }

    def get_level_progress(self, user_id: str, level_id: str) -> Dict:
        """Get user's progress for a specific level"""
        level_tests = list(self.db.level_test_submissions.find({
            'user': ObjectId(user_id),
            'level': ObjectId(level_id)
        }).sort('score', -1))  # Get highest score

        # Check if user has passed the level test (80% threshold)
        test_passed = any(test['score'] >= 0.8 for test in level_tests)
        
        return {
            'test_submitted': bool(level_tests),
            'test_passed': test_passed,
            'highest_score': max((test['score'] for test in level_tests), default=0)
        }
