from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from bson.objectid import ObjectId
from utils.db import get_db
from utils.exceptions import AppError

def create_jwt_token(identity, expires_delta=None):
    """
    Create a JWT token for the given identity.
    :param identity: The identity of the user (e.g., user ID)
    :param expires_delta: Optional expiration time for the token
    :return: JWT token as a string
    """
    return create_access_token(identity=identity, expires_delta=expires_delta)

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        db = get_db()
        user = db.users.find_one({'_id': ObjectId(user_id)})
        if not user or not user.get('is_staff'):
            raise AppError("Admin access required", 403)
        return fn(*args, **kwargs)
    return wrapper
