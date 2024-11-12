from .settings import *
from datetime import timedelta  # Add this import

# Override database to use SQLite for testing
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'test_db.sqlite3',
    }
}

# Test-specific settings
DEBUG = True
SECRET_KEY = 'test-secret-key-not-for-production'

# Reduce password hashing iterations for faster tests
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Modify JWT settings for testing
SIMPLE_JWT = {
    **SIMPLE_JWT,  # Inherit existing settings
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),  # Shorter token lifetime
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

# Disable authentication for testing
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    'DEFAULT_PERMISSION_CLASSES': [],
}

# Optional: Modify logging to reduce verbosity during tests
LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'handlers': {
        'null': {
            'class': 'logging.NullHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['null'],
            'level': 'CRITICAL',
        },
    },
}
