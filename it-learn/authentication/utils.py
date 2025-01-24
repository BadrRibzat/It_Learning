from utils.db import get_db
from werkzeug.security import generate_password_hash, check_password_hash

def create_user(email, password, **extra_fields):
    db = get_db()
    user_data = {
        'email': email,
        'password': generate_password_hash(password),
        'is_active': True,
        'is_staff': False,
        'quiz_submissions': [],
        'level_test_submissions': [],
        **extra_fields
    }
    result = db.users.insert_one(user_data)
    user_data['_id'] = result.inserted_id
    return user_data

def get_user_by_email(email):
    db = get_db()
    return db.users.find_one({'email': email})

def check_password(raw_password, hashed_password):
    return check_password_hash(hashed_password, raw_password)

def hash_password(password):
    return generate_password_hash(password)

def verify_password(hashed_password, password):
    return check_password_hash(hashed_password, password)
