# test_manage.py
import pytest
from unittest.mock import patch
import sys
import os
from manage import main

@pytest.mark.django_db
def test_main_function():
    with patch.object(sys, 'argv', ['manage.py', 'test']):
        with patch('django.core.management.execute_from_command_line') as mock_execute:
            main()
            mock_execute.assert_called_once()

    with patch.object(sys, 'argv', ['manage.py', 'runserver']):
        with patch('django.core.management.execute_from_command_line') as mock_execute:
            main()
            mock_execute.assert_called_once()

def test_environment_variables():
    with patch.dict(os.environ, {
        'DB_NAME': 'test_db',
        'DB_USER': 'test_user',
        'DB_PASSWORD': 'test_password',
        'DB_HOST': 'localhost',
        'DB_PORT': '5432'
    }):
        with patch('builtins.print') as mock_print:
            # Pass a valid Django management command
            with patch.object(sys, 'argv', ['manage.py', 'check']):
                main()
                mock_print.assert_any_call('DB_NAME:', 'test_db')
                mock_print.assert_any_call('DB_USER:', 'test_user')
                mock_print.assert_any_call('DB_PASSWORD:', 'test_password')
                mock_print.assert_any_call('DB_HOST:', 'localhost')
                mock_print.assert_any_call('DB_PORT:', '5432')
