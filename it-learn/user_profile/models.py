from flask_restx import fields

def init_models(api):
    """Initialize all models for the profile namespace"""
    
    # Base Models
    achievement_model = api.model('Achievement', {
        'id': fields.String(description='Achievement ID'),
        'name': fields.String(description='Achievement name'),
        'description': fields.String(description='Achievement description'),
        'icon': fields.String(description='Achievement icon'),
        'earned_at': fields.DateTime(description='When the achievement was earned')
    })

    points_history_model = api.model('PointsHistory', {
        'amount': fields.Integer(description='Points earned/spent'),
        'action': fields.String(description='Action that led to points change'),
        'timestamp': fields.DateTime(description='When the points changed'),
        'details': fields.Raw(description='Additional details about the points change')
    })

    learning_streak_model = api.model('LearningStreak', {
        'current_streak': fields.Integer(description='Current daily learning streak'),
        'longest_streak': fields.Integer(description='Longest streak achieved'),
        'last_activity_date': fields.Date(description='Last learning activity date'),
        'next_milestone': fields.Integer(description='Days until next streak milestone')
    })

    # Define activity model first before using it
    activity_model = api.model('Activity', {
        'id': fields.String(description='Activity ID'),
        'type': fields.String(description='Activity type'),
        'description': fields.String(description='Activity description'),
        'timestamp': fields.DateTime(description='When the activity occurred'),
        'details': fields.Raw(description='Additional activity details'),
        'points_earned': fields.Integer(description='Points earned from activity')
    })

    activity_feed_model = api.model('ActivityFeed', {
        'activities': fields.List(fields.Nested(activity_model)),
        'summary': fields.Raw(description='Summary information')
    })

    learning_stats_model = api.model('LearningStats', {
        'total_points': fields.Integer(description='Total points earned'),
        'rank': fields.String(description='Current rank based on points'),
        'completed_lessons': fields.Integer(description='Number of completed lessons'),
        'correct_answers': fields.Integer(description='Total correct answers'),
        'accuracy_rate': fields.Float(description='Overall accuracy percentage'),
        'quiz_average': fields.Float(description='Average quiz score'),
        'time_spent': fields.Integer(description='Total learning time in minutes'),
        'achievements': fields.List(fields.Nested(achievement_model)),
        'streak': fields.Nested(learning_streak_model),
        'points_history': fields.List(fields.Nested(points_history_model))
    })

    profile_data_model = api.model('ProfileData', {
        'id': fields.String(description='Profile ID'),
        'user_id': fields.String(description='User ID'),
        'full_name': fields.String(description='User full name'),
        'email': fields.String(description='User email'),
        'bio': fields.String(description='User bio'),
        'profile_picture': fields.String(description='Profile picture URL'),
        'preferred_language': fields.String(description='Preferred language'),
        'joined_date': fields.DateTime(description='Account creation date'),
        'last_active': fields.DateTime(description='Last activity timestamp')
    })

    # Response Models
    profile_response_model = api.model('ProfileResponse', {
        'message': fields.String(description='Response message'),
        'profile_data': fields.Nested(profile_data_model),
        'learning_stats': fields.Nested(learning_stats_model),
        'recent_activities': fields.List(fields.Nested(activity_model)),
        'current_level': fields.Raw(description='Current level information')
    })

    # Request Models
    profile_update_model = api.model('ProfileUpdate', {
        'full_name': fields.String(required=False, description='User full name'),
        'bio': fields.String(required=False, description='User bio'),
        'preferred_language': fields.String(required=False, description='Preferred language')
    })

    profile_upload_response = api.model('ProfileUploadResponse', {
        'message': fields.String(description='Response message'),
        'profile_picture': fields.String(description='Base64 encoded profile picture')
    })

    points_response_model = api.model('PointsResponse', {
        'total_points': fields.Integer(description='Total points earned'),
        'current_rank': fields.String(description='Current rank'),
        'points_history': fields.List(fields.Nested(points_history_model)),
        'points_breakdown': fields.Raw(description='Points breakdown by activity'),
        'next_rank': fields.Raw(description='Next rank information')
    })

    progress_circle_model = api.model('ProgressCircle', {
        'overall_progress': fields.Float(description='Overall progress percentage'),
        'level_progress': fields.Float(description='Level progress percentage'),
        'points_progress': fields.Float(description='Points progress percentage'),
        'streak': fields.Integer(description='Current streak'),
        'animations': fields.Raw(description='Animation settings')
    })

    return {
        'achievement': achievement_model,
        'points_history': points_history_model,
        'learning_streak': learning_streak_model,
        'learning_stats': learning_stats_model,
        'profile_data': profile_data_model,
        'activity': activity_model,
        'activity_feed': activity_feed_model,
        'profile_response': profile_response_model,
        'profile_update': profile_update_model,
        'profile_upload_response': profile_upload_response,
        'points_response': points_response_model,
        'progress_circle': progress_circle_model
    }
