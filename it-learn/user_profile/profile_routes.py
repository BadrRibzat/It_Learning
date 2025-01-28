from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from utils.exceptions import AppError
from services.progress_service import ProgressService
from services.level_service import LevelService
from .schemas import ProfileUpdateSchema
from utils.db import get_db
import json

profile_ns = Namespace('profile', description='User profile operations')

# Initialize services
progress_service = ProgressService()
level_service = LevelService()

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

def serialize_mongodb_object(obj):
    if isinstance(obj, dict):
        return {k: serialize_mongodb_object(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [serialize_mongodb_object(item) for item in obj]
    elif isinstance(obj, ObjectId):
        return str(obj)
    return obj

# Models for Swagger documentation
profile_update_model = profile_ns.model('ProfileUpdate', {
    'bio': fields.String(description='User bio'),
    'preferred_language': fields.String(description='Preferred language'),
    'profile_picture': fields.String(description='Profile picture URL')
})

@profile_ns.route('/profile')
class Profile(Resource):
    @jwt_required()
    def get(self):
        """Get user's profile and statistics"""
        try:
            db = get_db()
            user_id = get_jwt_identity()
            
            # Fetch user and profile data
            user = db.users.find_one({'_id': ObjectId(user_id)})
            if not user:
                # Create default user profile
                user = {
                    '_id': ObjectId(user_id),
                    'full_name': 'New User',
                    'current_level': 1
                }
                db.users.insert_one(user)

            profile = db.profiles.find_one({'user._id': ObjectId(user_id)})
            
            # Create profile if it doesn't exist
            if not profile:
                profile_data = {
                    'user': serialize_mongodb_object(user),
                    'profile_picture': None,
                    'bio': None,
                    'preferred_language': 'en'
                }
                profile_id = db.profiles.insert_one(profile_data).inserted_id
                profile = db.profiles.find_one({'_id': profile_id})
            
            # Serialize profile data
            profile = serialize_mongodb_object(profile)
            
            # Get level progression with error handling
            try:
                level_progression = level_service.get_level_progression(user_id)
            except Exception:
                level_progression = {
                    'current_level': 'beginner',
                    'next_level': 'intermediate',
                    'required_score': 0.8,
                    'unlocked_levels': ['beginner'],
                    'progress': 0
                }
            
            # Return complete response
            return {
                'message': f"Welcome back, {user.get('full_name', 'User')}!",
                'profile_data': profile,
                'statistics': {
                    'flashcard_progress': [],  # Initialize empty for new users
                    'level_progression': level_progression
                }
            }, 200
            
        except Exception as e:
            logger.error(f"Profile fetch error: {str(e)}")
            # Return default response
            return {
                'message': 'Welcome!',
                'profile_data': {
                    'bio': None,
                    'preferred_language': 'en',
                    'profile_picture': None,
                    'user': {'full_name': 'User'}
                },
                'statistics': {
                    'flashcard_progress': [],
                    'level_progression': {
                        'current_level': 'beginner',
                        'next_level': 'intermediate',
                        'required_score': 0.8,
                        'unlocked_levels': ['beginner'],
                        'progress': 0
                    }
                }
            }, 200

@profile_ns.route('/update')
class UpdateProfile(Resource):
    @jwt_required()
    @profile_ns.expect(profile_update_model)
    def put(self):
        """Update user profile"""
        data = profile_ns.payload
        try:
          schema = ProfileUpdateSchema(**data)
        except Exception as e:
          raise AppError(f"Validation error: {e}", 400)

        db = get_db()
        user_id = get_jwt_identity()
    
        updates = {
            'bio': schema.bio,
            'preferred_language': schema.preferred_language,
            'profile_picture': schema.profile_picture
        }
    
        db.profiles.update_one(
            {'user._id': ObjectId(user_id)},
            {'$set': updates}
        )
    
        return {"message": "Profile updated successfully"}, 200
