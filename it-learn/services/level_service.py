from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId
from typing import Optional, Dict, List
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

    def serialize_mongodb_object(self, obj):
        if isinstance(obj, dict):
            return {k: self.serialize_mongodb_object(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self.serialize_mongodb_object(item) for item in obj]
        elif isinstance(obj, ObjectId):
            return str(obj)
        return obj

    @cache(ttl=3600)
    def get_level_progression(self, user_id: str) -> Dict:
        """Get user's current level and unlock requirements"""
        try:
            user = self.db.users.find_one({'_id': ObjectId(user_id)})
            levels = list(self.db.levels.find().sort('order', 1))
            
            if not user:
                # Return default level progression for new users with all levels info
                return {
                    'current_level': 'beginner',
                    'next_level': 'intermediate',
                    'required_score': 0.8,
                    'unlocked_levels': ['beginner'],
                    'progress': 0,
                    'levels': [self._format_level_card(level, ['beginner']) for level in levels]
                }

            # Get current level
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
                'progress': user.get('level_progress', 0),
                'levels': [self._format_level_card(level, unlocked_levels) for level in levels]
            }
        except Exception as e:
            logger.error(f"Error getting level progression: {str(e)}")
            levels = list(self.db.levels.find().sort('order', 1))
            return {
                'current_level': 'beginner',
                'next_level': 'intermediate',
                'required_score': 0.8,
                'unlocked_levels': ['beginner'],
                'progress': 0,
                'levels': [self._format_level_card(level, ['beginner']) for level in levels]
            }
    
    def _format_level_card(self, level: Dict, unlocked_levels: List[str]) -> Dict:
        """Format level data into a card format"""
        return {
            'id': str(level['_id']),
            'name': level['name'],
            'order': level['order'],
            'description': level.get('description', ''),
            'icon': level.get('icon', ''),
            'is_unlocked': level['name'] == 'beginner' or level['name'] in unlocked_levels,
            'required_score': 0.8,
            'test_available': level['name'] != 'beginner'
        }
    
    def attempt_level_unlock(self, user_id: str, test_id: str) -> Dict:
        """Process level test submission and unlock if criteria met"""
        if not ObjectId.is_valid(test_id):
            raise AppError("Invalid level test ID format", 400)
            
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
            # Get the level being tested
            level = self.db.levels.find_one({'_id': test['level']})
            if level:
                self.db.users.update_one(
                    {'_id': ObjectId(user_id)},
                    {
                        '$addToSet': {'unlocked_levels': level['name']},
                        '$set': {'current_level': level['order']}
                    }
                )
                return {
                    'unlocked': True, 
                    'score': best_submission['score'],
                    'level_name': level['name'],
                    'level_order': level['order']
                }
        
        return {'unlocked': False, 'required_score': 0.8}

    def _get_next_level(self, current_order: int) -> Optional[Dict]:
        """Get the next level based on current order"""
        return self.db.levels.find_one({'order': current_order + 1})
