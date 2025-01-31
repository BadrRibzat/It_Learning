from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity, get_jwt
)
from bson.objectid import ObjectId
from datetime import datetime, timedelta, UTC
import logging

def serialize_datetime(dt):
    """Convert datetime to ISO format string"""
    return dt.isoformat() if dt else None

from utils.db import get_db
from utils.exceptions import AppError
from .schemas import UserRegisterSchema, UserLoginSchema
from .utils import (
    create_user, get_user_by_email, check_password,
    is_account_locked, increment_login_attempts, reset_login_attempts
)

# Configure logging
logger = logging.getLogger(__name__)

# Initialize namespace
auth_ns = Namespace(
    'auth', 
    description='Authentication API endpoints for the Command Line Learning platform'
)

# Define API Models
auth_models = {
    'register': auth_ns.model('Register', {
        'email': fields.String(required=True, description='User email'),
        'password': fields.String(required=True, description='User password'),
        'confirm_password': fields.String(required=True, description='Confirm password'),
        'full_name': fields.String(required=True, description='Full name'),
        'date_of_birth': fields.String(description='Date of birth'),
        'current_language': fields.String(default='en', description='Current language')
    }),
    
    'login': auth_ns.model('Login', {
        'email': fields.String(required=True, description='User email'),
        'password': fields.String(required=True, description='User password')
    }),
    
    'token': auth_ns.model('Token', {
        'access_token': fields.String(description='JWT access token'),
        'message': fields.String(description='Response message')
    }),
    
    'user_response': auth_ns.model('UserResponse', {
        'id': fields.String(description='User ID'),
        'email': fields.String(description='User email'),
        'full_name': fields.String(description='User full name'),
        'current_language': fields.String(description='Current language'),
        'created_at': fields.String(description='Account creation date')
    }),
    
    'message': auth_ns.model('Message', {
        'message': fields.String(description='Response message')
    }),
    
    'error': auth_ns.model('Error', {
        'error': fields.String(description='Error message')
    })
}

@auth_ns.route('/register')
class Register(Resource):
    @auth_ns.expect(auth_models['register'])
    @auth_ns.response(200, 'Success', auth_models['user_response'])
    @auth_ns.response(400, 'Validation Error', auth_models['error'])
    def post(self):
        """Register a new user"""
        try:
            data = auth_ns.payload
            schema = UserRegisterSchema(**data)
            
            # Check if email exists
            existing_user = get_user_by_email(schema.email)
            if existing_user:
                return {"error": "Email already exists"}, 400

            # Create user
            user = create_user(
                email=schema.email,
                password=schema.password,
                full_name=schema.full_name,
                date_of_birth=schema.date_of_birth,
                current_language=schema.current_language
            )

            return {
                "message": "Registration successful",
                "user": {
                    "id": str(user['_id']),
                    "email": user['email'],
                    "full_name": user['full_name'],
                    "current_language": user['current_language'],
                    "created_at": serialize_datetime(user['created_at'])
                }
            }, 200

        except ValueError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            return {"error": "Registration failed"}, 500

@auth_ns.route('/login')
class Login(Resource):
    @auth_ns.expect(auth_models['login'])
    @auth_ns.response(200, 'Success', auth_models['token'])
    @auth_ns.response(401, 'Invalid Credentials', auth_models['error'])
    def post(self):
        """Login user"""
        try:
            data = auth_ns.payload
            schema = UserLoginSchema(**data)
            
            if is_account_locked(schema.email):
                return {"error": "Account temporarily locked"}, 401

            user = get_user_by_email(schema.email)
            if not user or not check_password(schema.password, user['password']):
                increment_login_attempts(schema.email)
                return {"error": "Invalid credentials"}, 401

            reset_login_attempts(schema.email)
            
            access_token = create_access_token(identity=str(user['_id']))
            
            # Update last login
            db = get_db()
            db.users.update_one(
                {'_id': user['_id']},
                {'$set': {'last_login': datetime.now(UTC)}}
            )

            return {
                "message": "Login successful",
                "access_token": access_token
            }, 200

        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return {"error": "Login failed"}, 500

@auth_ns.route('/refresh')
class TokenRefresh(Resource):
    @jwt_required()
    @auth_ns.response(200, 'Success', auth_models['token'])
    @auth_ns.response(401, 'Unauthorized', auth_models['error'])
    def post(self):
        """Refresh access token"""
        try:
            current_user = get_jwt_identity()
            new_token = create_access_token(identity=current_user)
            return {"access_token": new_token}, 200
        except Exception as e:
            logger.error(f"Token refresh error: {str(e)}")
            return {"error": "Token refresh failed"}, 500

@auth_ns.route('/logout')
class Logout(Resource):
    @jwt_required()
    @auth_ns.response(200, 'Success', auth_models['message'])
    @auth_ns.response(500, 'Server Error', auth_models['error'])
    def post(self):
        """Logout user"""
        try:
            jti = get_jwt()["jti"]
            user_id = get_jwt_identity()
            
            db = get_db()
            db.revoked_tokens.insert_one({
                "jti": jti,
                "user_id": user_id,
                "created_at": datetime.now(UTC)
            })
            
            # Cleanup expired tokens
            cleanup_expired_tokens()
            
            return {"message": "Logout successful"}, 200
        except Exception as e:
            logger.error(f"Logout error: {str(e)}")
            return {"error": "Logout failed"}, 500

def cleanup_expired_tokens():
    """Remove expired tokens from revoked_tokens collection"""
    try:
        db = get_db()
        expiry_date = datetime.now(UTC) - timedelta(days=7)
        db.revoked_tokens.delete_many({
            'created_at': {'$lt': expiry_date}
        })
    except Exception as e:
        logger.error(f"Token cleanup error: {str(e)}")
