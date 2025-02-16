from bson import ObjectId
from utils.redis_cache import cache
from utils.db import get_db

class LevelService:
    def __init__(self):
        self.db = get_db()

    @cache(ttl=3600)
    def get_levels(self):
        """Get all levels with their lessons"""
        levels = list(self.db.levels.find().sort('order', 1))
        for level in levels:
            level['lessons'] = list(self.db.lessons.find({'level': ObjectId(level['_id'])}).sort('order', 1))
        return levels

    def get_lessons_by_level(self, level_id: str):
        """Get lessons for a specific level"""
        level = self.db.levels.find_one({'_id': ObjectId(level_id)})
        if not level:
            return []
        return list(self.db.lessons.find({'level': ObjectId(level_id)}).sort('order', 1))
