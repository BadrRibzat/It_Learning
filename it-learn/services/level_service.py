from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId
from typing import Optional, Dict
from utils.redis_cache import cache
from utils.exceptions import AppError
from utils.db import get_db
from config import config
import logging

# Add logger
logger = logging.getLogger(__name__)

class LevelService:
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

    @cache(ttl=3600)
    def get_level_progression(self, user_id: str) -> Dict:
        """Get user's current level and unlock requirements"""
        try:
            user = self.db.users.find_one({'_id': ObjectId(user_id)})
            if not user:
                # Return default level progression for new users
                return {
                    'current_level': 'beginner',
                    'next_level': 'intermediate',
                    'required_score': 0.8,
                    'unlocked_levels': ['beginner'],
                    'progress': 0
                }

            # Get or create current level
            current_level = self.db.levels.find_one({'order': user.get('current_level', 1)})
            if not current_level:
                current_level = {
                    'name': 'beginner',
                    'order': 1
                }
                
            unlocked_levels = user.get('unlocked_levels', ['beginner'])
            if 'beginner' not in unlocked_levels:
                unlocked_levels.append('beginner')
            
            next_level = self._get_next_level(current_level['order'])
            next_level_name = next_level['name'] if next_level else None

            return {
                'current_level': current_level['name'],
                'next_level': next_level_name,
                'required_score': 0.8,
                'unlocked_levels': unlocked_levels,
                'progress': user.get('level_progress', 0)
            }
        except Exception as e:
            # Log the error but return default progression
            logger.error(f"Error getting level progression: {str(e)}")
            return {
                'current_level': 'beginner',
                'next_level': 'intermediate',
                'required_score': 0.8,
                'unlocked_levels': ['beginner'],
                'progress': 0
            }
    
    def attempt_level_unlock(self, user_id: str, test_id: str) -> Dict:
        """Process level test submission and unlock if criteria met"""
        test = self.db.level_tests.find_one({'_id': ObjectId(test_id)})
        if not test:
            raise AppError("Test not found", 404)

        submissions = list(self.db.level_test_submissions.find({
            'user': ObjectId(user_id),
            'level_test': ObjectId(test_id)
        }))
        
        if not submissions:
            return {'unlocked': False, 'required_score': 0.8}
        
        best_submission = max(submissions, key=lambda x: x.get('score', 0), default=None)
        
        if best_submission and best_submission['score'] >= 0.8 * test['total_questions']:
            self.db.users.update_one(
                {'_id': ObjectId(user_id)},
                {'$addToSet': {'unlocked_levels': test['target_level']}}
            )
            return {'unlocked': True, 'score': best_submission['score']}
        
        return {'unlocked': False, 'required_score': 0.8}

    def _get_next_level(self, current_order: int) -> Optional[Dict]:
        return self.db.levels.find_one({'order': current_order + 1})
