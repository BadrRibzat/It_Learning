from datetime import datetime
from utils.exceptions import AppError

def validate_language_code(language_code):
    """Validate language code"""
    allowed_languages = {'ar', 'en', 'fr', 'es', 'de', 'ko', 'ja', 'zh'}
    if language_code not in allowed_languages:
        raise AppError("Invalid language code", 400)
    return True

def validate_date_format(date_str):
    """Validate date string format"""
    try:
        datetime.strptime(date_str, "%Y-%m-%d")
        return True
    except ValueError:
        raise AppError("Invalid date format. Use YYYY-MM-DD", 400)
