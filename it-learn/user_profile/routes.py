from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask import request
from datetime import datetime, UTC
import logging
from bson import ObjectId
from pathlib import Path
import base64
from werkzeug.datastructures import FileStorage

from utils.exceptions import AppError
from utils.db import get_db
from .models import init_models
from .services.points_service import PointsService
from .services.activity_service import ActivityService
from .services.progress_service import ProgressService
from .utils.image_utils import process_image, validate_file
from .utils.validators import validate_language_code
from .schemas import ProfileUpdateSchema

# Configure logging
logger = logging.getLogger(__name__)

def serialize_datetime(dt):
    """Convert datetime to ISO format string"""
    return dt.isoformat() if dt else None

def serialize_objectid(obj_id):
    """Convert ObjectId to string"""
    return str(obj_id) if obj_id else None

# Initialize namespace
profile_ns = Namespace(
    'profile', 
    description='User profile and learning progress tracking for command line mastery'
)

# Initialize models using the existing init_models function
profile_models = init_models(profile_ns)

# Configure upload settings
BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_FOLDER = BASE_DIR / 'uploads' / 'profile_pictures'
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

# Initialize services
db = get_db()
points_service = PointsService(db)
activity_service = ActivityService(db)
progress_service = ProgressService(db)

# File upload parser
upload_parser = profile_ns.parser()
upload_parser.add_argument(
    'file', 
    type=FileStorage, 
    location='files', 
    required=True, 
    help='Profile picture file (JPEG/PNG, max 5MB)'
)

@profile_ns.route('/profile')
class Profile(Resource):
    @jwt_required()
    @profile_ns.marshal_with(profile_models['profile_response'])
    @profile_ns.doc(
        description='Get complete user profile with learning statistics',
        security='Bearer Auth',
        responses={
            200: 'Success',
            401: 'Unauthorized',
            404: 'Profile not found',
            500: 'Server error'
        }
    )
    def get(self):
        """Get user's complete profile and learning statistics"""
        try:
            user_id = get_jwt_identity()
            user = db.users.find_one({'_id': ObjectId(user_id)})
            if not user:
                raise AppError("User not found", 404)

            # Get or create profile
            profile = self._get_or_create_profile(user)
            
            # Get statistics and activities
            learning_stats = points_service.get_user_points(user_id)
            recent_activities = activity_service.get_user_activities(user_id, limit=10)
            progress_data = progress_service.get_progress_circle_data(user_id)

            return {
                'message': f"Welcome back, {profile.get('full_name', 'User')}!",
                'profile_data': {
                    **profile,
                    'id': serialize_objectid(profile.get('_id')),
                    'user_id': serialize_objectid(profile.get('user_id')),
                    'joined_date': serialize_datetime(profile.get('joined_date')),
                    'last_active': serialize_datetime(profile.get('last_active'))
                },
                'learning_stats': learning_stats,
                'recent_activities': recent_activities,
                'current_level': progress_data
            }

        except AppError as e:
            raise e
        except Exception as e:
            logger.error(f"Error fetching profile: {str(e)}")
            raise AppError("Failed to fetch profile", 500)

    def _get_or_create_profile(self, user):
        """Get existing profile or create new one"""
        profile = db.profiles.find_one({'user_id': user['_id']})
        if not profile:
            profile = {
                'user_id': user['_id'],
                'email': user['email'],
                'full_name': user.get('full_name', 'New User'),
                'bio': None,
                'profile_picture': None,
                'preferred_language': 'en',
                'joined_date': user.get('created_at', datetime.now(UTC)),
                'last_active': datetime.now(UTC)
            }
            db.profiles.insert_one(profile)
        
        profile['email'] = user['email']
        return profile

@profile_ns.route('/statistics')
class Statistics(Resource):
    @jwt_required()
    @profile_ns.marshal_with(profile_models['learning_stats'])
    @profile_ns.doc(security='Bearer Auth')
    def get(self):
        """Get user's learning statistics"""
        try:
            user_id = get_jwt_identity()
            stats = points_service.get_user_points(user_id)
            if not stats:
                raise AppError("Statistics not found", 404)
            return stats
        except AppError as e:
            raise e
        except Exception as e:
            logger.error(f"Error fetching statistics: {str(e)}")
            raise AppError("Failed to fetch statistics", 500)

@profile_ns.route('/update')
class UpdateProfile(Resource):
    @jwt_required()
    @profile_ns.expect(profile_models['profile_update'])
    @profile_ns.marshal_with(profile_models['profile_response'])
    @profile_ns.doc(
        description='Update user profile information',
        security='Bearer Auth',
        responses={
            200: 'Profile updated successfully',
            400: 'Invalid input',
            401: 'Unauthorized',
            500: 'Server error'
        }
    )
    def put(self):
        """Update user profile information"""
        try:
            user_id = get_jwt_identity()
            data = profile_ns.payload

            try:
                schema = ProfileUpdateSchema(**data)
            except Exception as validation_error:
                raise AppError(str(validation_error), 400)

            # Update profile
            result = db.profiles.update_one(
                {'user_id': ObjectId(user_id)},
                {'$set': {k: v for k, v in data.items() if v is not None}},
                upsert=True
            )

            # Track activity
            activity_service.track_activity(user_id, 'profile_update')

            # Get updated profile
            updated_profile = self._get_updated_profile(user_id)
            return updated_profile

        except AppError as e:
            raise e
        except Exception as e:
            logger.error(f"Profile update error: {str(e)}")
            raise AppError("Failed to update profile", 500)

    def _get_updated_profile(self, user_id):
        """Get updated profile data"""
        user = db.users.find_one({'_id': ObjectId(user_id)})
        if not user:
            raise AppError("User not found", 404)

        profile = db.profiles.find_one({'user_id': ObjectId(user_id)})
        if not profile:
            raise AppError("Profile not found", 404)

        return {
            'message': "Profile updated successfully",
            'profile_data': {
                **profile,
                'id': serialize_objectid(profile.get('_id')),
                'user_id': serialize_objectid(profile.get('user_id')),
                'joined_date': serialize_datetime(profile.get('joined_date')),
                'last_active': serialize_datetime(profile.get('last_active'))
            }
        }

@profile_ns.route('/upload-picture')
class ProfilePicture(Resource):
    @jwt_required()
    @profile_ns.expect(upload_parser)
    @profile_ns.marshal_with(profile_models['profile_upload_response'])
    def post(self):
        """Upload profile picture"""
        try:
            user_id = get_jwt_identity()
            args = upload_parser.parse_args()
            file = args.get('file')

            if not file:
                raise AppError("No file provided", 400)

            # Validate file
            validate_file(file)
            
            try:
                # Create user-specific directory
                user_upload_dir = UPLOAD_FOLDER / str(user_id)
                user_upload_dir.mkdir(parents=True, exist_ok=True)

                # Generate filename
                timestamp = datetime.now(UTC).strftime('%Y%m%d_%H%M%S')
                filename = f"profile_{user_id}_{timestamp}.png"
                filepath = user_upload_dir / filename

                # Process and save image
                file.seek(0)  # Reset file pointer
                image_data = process_image(file, str(filepath))

                # Update database
                update_result = db.profiles.update_one(
                    {'user_id': ObjectId(user_id)},
                    {
                        '$set': {
                            'profile_picture': image_data,
                            'profile_picture_path': str(filepath),
                            'last_updated': datetime.now(UTC)
                        }
                    },
                    upsert=True
                )

                if not update_result.acknowledged:
                    raise AppError("Failed to update profile picture", 500)

                return {
                    "message": "Profile picture updated successfully",
                    "profile_picture": image_data
                }

            except Exception as e:
                logger.error(f"Error processing image: {str(e)}")
                raise AppError(f"Failed to process image: {str(e)}", 400)

        except AppError as e:
            logger.error(f"Profile picture upload error: {str(e)}")
            raise e
        except Exception as e:
            logger.error(f"Unexpected error during profile picture upload: {str(e)}")
            raise AppError("Failed to process profile picture", 500)

@profile_ns.route('/points')
class Points(Resource):
    @jwt_required()
    @profile_ns.marshal_with(profile_models['points_response'])
    @profile_ns.doc(
        description='Get user points and ranking information',
        security='Bearer Auth',
        responses={
            200: 'Success',
            401: 'Unauthorized',
            404: 'User not found',
            500: 'Server error'
        }
    )
    def get(self):
        """Get user's points information"""
        try:
            user_id = get_jwt_identity()
            points_info = points_service.get_user_points(user_id)
            if not points_info:
                raise AppError("User not found", 404)
            
            # Format datetime fields in points history
            if 'points_history' in points_info:
                points_info['points_history'] = [
                    {
                        **entry,
                        'timestamp': serialize_datetime(entry.get('timestamp'))
                    }
                    for entry in points_info['points_history']
                ]
            
            return points_info

        except AppError as e:
            raise e
        except Exception as e:
            logger.error(f"Error fetching points information: {str(e)}")
            raise AppError("Failed to fetch points information", 500)

@profile_ns.route('/progress-circle')
class ProgressCircle(Resource):
    @jwt_required()
    @profile_ns.marshal_with(profile_models['progress_circle'])
    @profile_ns.doc(
        description='Get user progress visualization data',
        security='Bearer Auth',
        responses={
            200: 'Success',
            401: 'Unauthorized',
            404: 'User not found',
            500: 'Server error'
        }
    )
    def get(self):
        """Get real-time progress circle data"""
        try:
            user_id = get_jwt_identity()
            progress_data = progress_service.get_progress_circle_data(user_id)
            if not progress_data:
                raise AppError("User not found", 404)
            return progress_data

        except AppError as e:
            raise e
        except Exception as e:
            logger.error(f"Error fetching progress data: {str(e)}")
            raise AppError("Failed to fetch progress data", 500)

@profile_ns.route('/activity')
class ActivityFeed(Resource):
    @jwt_required()
    @profile_ns.marshal_with(profile_models['activity_feed'])
    @profile_ns.doc(
        description='Get user activity history',
        params={
            'limit': 'Number of activities to return (default: 20)',
            'offset': 'Number of activities to skip (default: 0)'
        },
        security='Bearer Auth'
    )
    def get(self):
        """Get user's activity feed"""
        try:
            user_id = get_jwt_identity()
            limit = request.args.get('limit', 20, type=int)
            offset = request.args.get('offset', 0, type=int)
            
            activities = activity_service.get_user_activities(
                user_id, 
                limit=limit, 
                offset=offset
            )
            
            # Format datetime fields
            formatted_activities = [
                {
                    **activity,
                    'timestamp': serialize_datetime(activity.get('timestamp'))
                } if activity else {}
                for activity in activities
            ]
            
            return {
                'activities': formatted_activities,
                'summary': {
                    'total': len(formatted_activities),
                    'has_more': len(formatted_activities) == limit
                }
            }

        except Exception as e:
            logger.error(f"Error fetching activity feed: {str(e)}")
            raise AppError("Failed to fetch activity feed", 500)

@profile_ns.route('/delete')
class DeleteAccount(Resource):
    @jwt_required()
    @profile_ns.doc(
        description='Delete user account and all associated data',
        security='Bearer Auth',
        responses={
            200: 'Account deleted successfully',
            401: 'Unauthorized',
            500: 'Server error'
        }
    )
    def delete(self):
        """Delete user account and all associated data"""
        try:
            user_id = get_jwt_identity()
            jwt = get_jwt()

            # Add token to revoked tokens
            db.revoked_tokens.insert_one({
                "jti": jwt["jti"],
                "user_id": user_id,
                "created_at": datetime.now(UTC)
            })

            # Delete all user data
            collections_to_clean = [
                ('users', {'_id': ObjectId(user_id)}),
                ('profiles', {'user_id': ObjectId(user_id)}),
                ('lessons_progress', {'user': ObjectId(user_id)}),
                ('level_test_submissions', {'user': ObjectId(user_id)}),
                ('points_history', {'user_id': ObjectId(user_id)}),
                ('achievements', {'user_id': ObjectId(user_id)}),
                ('user_activity', {'user_id': ObjectId(user_id)}),
                ('revoked_tokens', {'user_id': user_id})
            ]

            for collection_name, query in collections_to_clean:
                db[collection_name].delete_many(query)

            # Delete profile picture if exists
            profile = db.profiles.find_one({'user_id': ObjectId(user_id)})
            if profile and profile.get('profile_picture'):
                try:
                    picture_path = UPLOAD_FOLDER / f"{user_id}.jpg"
                    if picture_path.exists():
                        picture_path.unlink()
                except Exception as e:
                    logger.warning(f"Failed to delete profile picture: {str(e)}")

            return {"message": "Account deleted successfully"}, 200

        except Exception as e:
            logger.error(f"Account deletion error: {str(e)}")
            raise AppError("Failed to delete account", 500)
