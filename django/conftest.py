import pytest
from django.core.management import call_command

@pytest.fixture(scope='session')
def django_db_setup(django_db_setup, django_db_blocker):
    with django_db_blocker.unblock():
        call_command('migrate')

@pytest.fixture
def api_client():
    from rest_framework.test import APIClient
    return APIClient()
