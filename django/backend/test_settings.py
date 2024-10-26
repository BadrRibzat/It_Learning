from .settings import *

# Override settings for testing
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Disable email sending during tests
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Disable debug mode during tests
DEBUG = False

# Use a faster password hasher for tests
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]
