from datetime import datetime, UTC
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

class ProgressService:
    def __init__(self, db):
        self.db = db

    def get_progress_circle_data(self, user_id):
        """Get user's progress circle data"""
        try:
            user = self.db.users.find_one({'_id': ObjectId(user_id)})
            if not user:
                return None

            level_progress = user.get('level_progress', 0)
            points_progress = self._calculate_points_progress(user.get('total_points', 0))
            streak_info = self._get_streak_info(user_id)
            
            overall_progress = self._calculate_overall_progress(
                level_progress,
                points_progress,
                streak_info['current_streak']
            )

            return {
                'overall_progress': overall_progress,
                'level_progress': level_progress,
                'points_progress': points_progress,
                'streak': streak_info['current_streak'],
                'animations': self._get_progress_animations(overall_progress)
            }
        except Exception as e:
            logger.error(f"Error getting progress data: {str(e)}")
            raise

    def _calculate_points_progress(self, points):
        """Calculate progress to next rank"""
        ranks = [(0, 'Beginner'), (1000, 'Apprentice'), (2500, 'Explorer')]
        for threshold, _ in ranks:
            if points < threshold:
                return (points / threshold) * 100
        return 100

    def _get_streak_info(self, user_id):
        """Get user's learning streak information"""
        activities = list(self.db.user_activity.find(
            {'user_id': ObjectId(user_id)}
        ).sort('timestamp', -1))
        
        current_streak = 0
        if activities:
            current_date = datetime.now(UTC).date()
            for activity in activities:
                activity_date = activity['timestamp'].date()
                if (current_date - activity_date).days == 1:
                    current_streak += 1
                    current_date = activity_date
                elif (current_date - activity_date).days > 1:
                    break
        
        return {'current_streak': current_streak}

    def _calculate_overall_progress(self, level_prog, points_prog, streak):
        """Calculate weighted overall progress"""
        weights = {
            'level': 0.5,
            'points': 0.3,
            'streak': 0.2
        }
        
        streak_progress = min(100, (streak / 7) * 100)
        
        return (
            level_prog * weights['level'] +
            points_prog * weights['points'] +
            streak_progress * weights['streak']
        )

    def _get_progress_animations(self, progress):
        """Get animation settings based on progress"""
        return {
            'circle_color': self._get_progress_color(progress),
            'celebration': progress >= 100,
            'milestone': self._check_milestone(progress)
        }

    @staticmethod
    def _get_progress_color(progress):
        """Get color based on progress percentage"""
        if progress < 30:
            return '#FF6B6B'
        elif progress < 60:
            return '#FFD93D'
        elif progress < 90:
            return '#4DABF7'
        return '#51CF66'

    @staticmethod
    def _check_milestone(progress):
        """Check if current progress hits a milestone"""
        milestones = [25, 50, 75, 100]
        return any(abs(progress - milestone) < 1 for milestone in milestones)
