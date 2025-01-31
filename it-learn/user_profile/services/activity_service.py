from datetime import datetime, UTC
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

class ActivityService:
    def __init__(self, db):
        self.db = db

    def get_user_activities(self, user_id, limit=20, offset=0):
        """Get user's recent activities"""
        try:
            activities = list(self.db.user_activity.find(
                {'user_id': ObjectId(user_id)}
            ).sort('timestamp', -1).skip(offset).limit(limit))
        
            return [self._enrich_activity_data(activity) for activity in activities]
        except Exception as e:
            logger.error(f"Error getting user activities: {str(e)}")
            return []

    def track_activity(self, user_id, activity_type, details=None):
        """Track new user activity"""
        try:
            activity = {
                'user_id': ObjectId(user_id),
                'type': activity_type,
                'timestamp': datetime.now(UTC),
                'details': details or {}
            }
            
            points = self._calculate_activity_points(activity_type)
            activity['points_earned'] = points
            
            # Record activity
            self.db.user_activity.insert_one(activity)
            
            # Update user points if applicable
            if points > 0:
                self._update_user_points(user_id, points, activity_type)
            
            return True
        except Exception as e:
            logger.error(f"Error tracking activity: {str(e)}")
            return False

    def _enrich_activity_data(self, activity):
        """Add additional context to activity data"""
        try:
            base_activity = {
                'id': str(activity['_id']),
                'type': activity['type'],
                'timestamp': activity['timestamp'],
                'points_earned': activity.get('points_earned', 0)
            }
            
            if activity['type'] == 'lesson_complete':
                lesson = self.db.lessons.find_one({'_id': activity['lesson_id']})
                if lesson:
                    base_activity.update({
                        'description': f"Completed lesson: {lesson['title']}",
                        'details': {
                            'lesson_name': lesson['title'],
                            'accuracy': activity.get('accuracy', 0),
                            'time_spent': activity.get('time_spent', 0)
                        }
                    })
            
            elif activity['type'] == 'quiz_complete':
                quiz = self.db.quizzes.find_one({'_id': activity['quiz_id']})
                if quiz:
                    lesson = self.db.lessons.find_one({'_id': quiz['lesson']})
                    base_activity.update({
                        'description': f"Completed quiz for: {lesson['title']}",
                        'details': {
                            'score': activity.get('score', 0),
                            'passed': activity.get('passed', False)
                        }
                    })
            
            return base_activity
        except Exception as e:
            logger.error(f"Error enriching activity data: {str(e)}")
            return None

    @staticmethod
    def _calculate_activity_points(activity_type):
        """Calculate points for different activity types"""
        points_table = {
            'lesson_complete': 50,
            'quiz_complete': 100,
            'flashcard_correct': 10,
            'level_test_pass': 200,
            'daily_streak': 20,
            'profile_update': 5
        }
        return points_table.get(activity_type, 0)

    def _update_user_points(self, user_id, points, activity_type):
        """Update user points and history"""
        self.db.users.update_one(
            {'_id': ObjectId(user_id)},
            {
                '$inc': {'total_points': points},
                '$push': {
                    'points_history': {
                        'amount': points,
                        'activity_type': activity_type,
                        'timestamp': datetime.now(UTC)
                    }
                }
            }
        )
