import pytest
from django.core.management import call_command
import asyncio
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from channels.testing import WebsocketCommunicator

User = get_user_model()

@pytest.fixture(scope='session')
def django_db_setup(django_db_setup, django_db_blocker):
    with django_db_blocker.unblock():
        call_command('migrate')

@pytest.fixture
def api_client():
    from rest_framework.test import APIClient
    return APIClient()

@pytest.fixture(scope="function")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    policy = asyncio.get_event_loop_policy()
    loop = policy.new_event_loop()
    yield loop
    loop.close()

@pytest.fixture
def test_user(db):
    """Create a test user"""
    return User.objects.create_user(
        username='testuser', 
        password='testpass',
        email='test@example.com'
    )

@pytest.fixture
async def channel_layer():
    channel_layer = get_channel_layer()
    yield channel_layer
    await channel_layer.flush()

@pytest.fixture
def auth_communicator(event_loop, test_user):
    """Create an authenticated communicator for WebSocket tests."""
    def _create_communicator(consumer_class, url):
        async def connect():
            # Parse the URL to extract parameters
            parts = url.strip('/').split('/')
            if len(parts) >= 3:
                type_name = parts[1]  # chat or learning_progress
                id_value = parts[2]
                
                # Create the communicator
                communicator = WebsocketCommunicator(
                    consumer_class.as_asgi(),
                    url,
                )
                
                # Set up the scope with all required data
                communicator.scope.update({
                    "type": "websocket",
                    "user": test_user,
                    "url_route": {
                        "args": (),
                        "kwargs": {
                            "room_name": str(id_value),
                            "user_id": str(id_value)
                        }
                    },
                    "headers": [],
                    "query_string": b"",
                    "path": url,
                })

                try:
                    connected, subprotocol = await communicator.connect()
                    if not connected:
                        await communicator.disconnect()
                        raise ValueError("Could not connect to websocket")
                    return communicator, test_user
                except Exception as e:
                    await communicator.disconnect()
                    raise e
            else:
                raise ValueError("Invalid WebSocket URL format")
                
        return connect()
    return _create_communicator
