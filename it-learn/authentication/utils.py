from datetime import datetime, timedelta, UTC
from werkzeug.security import generate_password_hash, check_password_hash
from utils.db import get_db
import re

def create_user(email, password, **extra_fields):
    db = get_db()
    user_data = {
        'email': email,
        'password': generate_password_hash(password),
        'is_active': True,
        'is_staff': False,
        'created_at': datetime.now(UTC),
        'last_login': None,
        'login_attempts': 0,
        **extra_fields
    }
    result = db.users.insert_one(user_data)
    user_data['_id'] = result.inserted_id
    return user_data

def is_strong_password(password):
    """Check if password meets strength requirements"""
    if len(password) < 8:
        return False
    if not re.search(r"\d", password):
        return False
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False
    return True

def get_user_by_email(email):
    db = get_db()
    return db.users.find_one({'email': email})

def check_password(raw_password, hashed_password):
    return check_password_hash(hashed_password, raw_password)

def hash_password(password):
    return generate_password_hash(password)

def verify_password(hashed_password, password):
    return check_password_hash(hashed_password, password)

def increment_login_attempts(email):
    db = get_db()
    db.users.update_one(
        {'email': email},
        {
            '$inc': {'login_attempts': 1},
            '$set': {'last_attempt': datetime.now(UTC)}
        }
    )

def reset_login_attempts(email):
    db = get_db()
    db.users.update_one(
        {'email': email},
        {
            '$set': {
                'login_attempts': 0,
                'last_attempt': None
            }
        }
    )

def is_account_locked(email):
    db = get_db()
    user = db.users.find_one({'email': email})
    if not user:
        return False

    attempts = user.get('login_attempts', 0)
    last_attempt = user.get('last_attempt')

    if attempts >= 5 and last_attempt:
        lockout_duration = timedelta(minutes=15)
        if datetime.utcnow() - last_attempt < lockout_duration:
            return True
        else:
            reset_login_attempts(email)
    return False
