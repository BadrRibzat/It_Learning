from datetime import datetime, timedelta
from pymongo import MongoClient
from bson import ObjectId
from utils.redis_cache import cache
from utils.db import get_db

class ProgressService:
    def __init__(self):
        self.db = get_db()

    @cache(ttl=1800)
    def get_lesson_progress(self, user_id: str, lesson_id: str) -> dict:
        """Get detailed progress for a lesson"""
        progress = self.db.lessons_progress.find_one({
            'user': ObjectId(user_id),
            'lesson': ObjectId(lesson_id)
        })
        
        return {
            'flashcards_completed': progress.get('flashcards_completed', False),
            'quiz_completed': progress.get('quiz_completed', False),
            'points': progress.get('points', 0),
            'total_points': 10  # Each lesson is worth 10 points when completed
        }

    def track_flashcard_progress(self, user_id: str, lesson_id: str, flashcard_id: str, is_correct: bool):
        """Track flashcard progress with timer"""
        now = datetime.utcnow()
        self.db.flashcards_progress.update_one(
            {'user': ObjectId(user_id), 'flashcard': ObjectId(flashcard_id)},
            {
                '$set': {
                    'last_attempt': now,
                    'is_correct': is_correct
                }
            },
            upsert=True
        )
        if is_correct:
            self._update_lesson_progress(user_id, lesson_id, 'flashcards')

    def track_quiz_progress(self, user_id: str, lesson_id: str, quiz_score: float):
        """Track quiz progress with timer"""
        if quiz_score >= 0.8:
            self._update_lesson_progress(user_id, lesson_id, 'quiz')

    def _update_lesson_progress(self, user_id: str, lesson_id: str, activity_type: str):
        """Update overall lesson progress"""
        now = datetime.utcnow()
        self.db.lessons_progress.update_one(
            {'user': ObjectId(user_id), 'lesson': ObjectId(lesson_id)},
            {
                '$set': {
                    f'{activity_type}_completed': True,
                    f'last_{activity_type}': now
                },
                '$inc': {'points': 10}
            },
            upsert=True
        )

    def check_timer_expired(self, user_id: str, lesson_id: str, activity_type: str) -> bool:
        """Check if timer has expired for an activity"""
        progress = self.db.lessons_progress.find_one({
            'user': ObjectId(user_id),
            'lesson': ObjectId(lesson_id)
        })
        
        last_activity = progress.get(f'last_{activity_type}')
        if not last_activity:
            return False
        
        time_limit = timedelta(minutes=2 if activity_type == 'flashcard' else 5)
        return datetime.utcnow() - last_activity > time_limit
