from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity, get_jwt
)
from bson.objectid import ObjectId
from utils.db import get_db
from .schemas import UserRegisterSchema, UserLoginSchema
from .utils import create_user, get_user_by_email, check_password
from utils.exceptions import AppError

auth_ns = Namespace('auth', description='Authentication operations')

# Models for Swagger documentation
register_model = auth_ns.model('Register', {
    'email': fields.String(required=True, description='User email'),
    'password': fields.String(required=True, description='User password'),
    'confirm_password': fields.String(required=True, description='Confirm password'),
    'full_name': fields.String(required=True, description='Full name'),
    'date_of_birth': fields.String(description='Date of birth'),
    'current_language': fields.String(default='en', description='Current language')
})

login_model = auth_ns.model('Login', {
    'email': fields.String(required=True, description='User email'),
    'password': fields.String(required=True, description='User password')
})

@auth_ns.route('/register')
class Register(Resource):
    @auth_ns.expect(register_model)
    def post(self):
        """Register a new user"""
        data = auth_ns.payload
        try:
            schema = UserRegisterSchema(**data)
        except Exception as e:
            raise AppError(f"Validation error: {str(e)}", 400)

        existing_user = get_user_by_email(schema.email)
        if existing_user:
            raise AppError("Email already exists", 400)

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
                "email": user['email']
            }
        }, 200

@auth_ns.route('/login')
class Login(Resource):
    @auth_ns.expect(login_model)
    def post(self):
        """Login a user"""
        data = auth_ns.payload
        try:
            schema = UserLoginSchema(**data)
        except Exception as e:
            raise AppError(f"Validation error: {e}", 400)
        user = get_user_by_email(schema.email)
        if not user or not check_password(schema.password, user['password']):
            raise AppError("Invalid credentials", 401)

        access_token = create_access_token(identity=str(user['_id']))
        return {
            "message": "Login successful",
            "access_token": access_token
        }, 200

@auth_ns.route('/logout')
class Logout(Resource):
    @jwt_required()
    def post(self):
        """Logout a user and invalidate the token"""
        db = get_db()
        user_id = get_jwt_identity()

        # Extract the JWT token's unique identifier (jti)
        jti = get_jwt()["jti"]

        # Add the token to the denylist
        db.revoked_tokens.insert_one({"jti": jti, "user_id": user_id})

        return {"message": "Logout successful"}, 200

@auth_ns.route('/delete')
class DeleteAccount(Resource):
    @jwt_required()
    def delete(self):
        """Delete a user account"""
        db = get_db()
        user_id = get_jwt_identity()

        # Add the current token to the denylist
        jti = get_jwt()["jti"]
        db.revoked_tokens.insert_one({"jti": jti, "user_id": user_id})

        # Delete user and related data
        db.users.delete_one({'_id': ObjectId(user_id)})
        db.profiles.delete_one({'user._id': ObjectId(user_id)})
        db.lessons_progress.delete_many({'user': ObjectId(user_id)})
        db.level_test_submissions.delete_many({'user': ObjectId(user_id)})

        return {"message": "Account deleted successfully"}, 200
