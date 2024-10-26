#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

from decouple import config
from dotenv import load_dotenv

def main():
    """Run administrative tasks."""
    # Load environment variables from .env file
    load_dotenv()

    # Verify environment variables
    print("DB_NAME:", os.getenv('DB_NAME'))
    print("DB_USER:", os.getenv('DB_USER'))
    print("DB_PASSWORD:", os.getenv('DB_PASSWORD'))
    print("DB_HOST:", os.getenv('DB_HOST'))
    print("DB_PORT:", os.getenv('DB_PORT'))

    if 'test' in sys.argv:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.test_settings')
    else:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
