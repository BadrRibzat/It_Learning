from datetime import datetime, UTC
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

class PointsService:
    def __init__(self, db):
        self.db = db

    def get_user_points(self, user_id):
        """Get user points information"""
        try:
            user = self.db.users.find_one({'_id': ObjectId(user_id)})
            if not user:
                return None

            return {
                'total_points': user.get('total_points', 0),
                'current_rank': self.calculate_rank(user.get('total_points', 0)),
                'points_history': self.get_points_history(user_id),
                'points_breakdown': self.get_points_breakdown(user_id),
                'next_rank': self.get_next_rank_info(user.get('total_points', 0))
            }
        except Exception as e:
            logger.error(f"Error getting user points: {str(e)}")
            raise

    def get_points_history(self, user_id, limit=10):
        """Get recent points history"""
        return list(self.db.points_history.find(
            {'user_id': ObjectId(user_id)}
        ).sort('timestamp', -1).limit(limit))

    def get_points_breakdown(self, user_id):
        """Get points breakdown by activity type"""
        pipeline = [
            {'$match': {'user_id': ObjectId(user_id)}},
            {'$group': {
                '_id': '$activity_type',
                'total_points': {'$sum': '$points'},
                'count': {'$sum': 1}
            }}
        ]
        
        breakdown = self.db.points_history.aggregate(pipeline)
        return {
            doc['_id']: {
                'points': doc['total_points'],
                'count': doc['count']
            }
            for doc in breakdown
        }

    @staticmethod
    def calculate_rank(total_points):
        """Calculate user rank based on total points"""
        ranks = [
            (0, 'Beginner'),
            (1000, 'Apprentice'),
            (2500, 'Explorer'),
            (5000, 'Adept'),
            (10000, 'Expert'),
            (20000, 'Master'),
            (50000, 'Grandmaster')
        ]
        
        for points, rank in reversed(ranks):
            if total_points >= points:
                return rank
        return 'Novice'

    def get_next_rank_info(self, current_points):
        """Get information about next rank"""
        ranks = [
            (0, 'Beginner'),
            (1000, 'Apprentice'),
            (2500, 'Explorer'),
            (5000, 'Adept'),
            (10000, 'Expert'),
            (20000, 'Master'),
            (50000, 'Grandmaster')
        ]
        
        for points, rank in ranks:
            if current_points < points:
                return {
                    'next_rank': rank,
                    'points_needed': points - current_points,
                    'progress_percentage': (current_points / points) * 100
                }
        
        return {
            'next_rank': None,
            'points_needed': 0,
            'progress_percentage': 100
        }
