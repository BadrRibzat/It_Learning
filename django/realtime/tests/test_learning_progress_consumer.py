import pytest
from channels.testing import WebsocketCommunicator
from realtime.consumers import LearningProgressConsumer
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from django.test import override_settings

User = get_user_model()

@pytest.fixture
def event_loop():
    import asyncio
    loop = asyncio.get_event_loop()
    yield loop
    loop.close()

@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
@override_settings(CHANNEL_LAYERS={'default': {'BACKEND': 'channels.layers.InMemoryChannelLayer'}})
async def test_learning_progress_consumer(auth_communicator, test_user):
    # Create communicator with authenticated user
    communicator, user = await auth_communicator(
        LearningProgressConsumer,
        f"/ws/learning_progress/{test_user.id}/"
    )

    try:
        # Test sending message
        await communicator.send_json_to({
            'type': 'learning_progress',
            'progress': 50,
            'lesson_id': 1
        })

        # Test receiving message
        response = await communicator.receive_json_from()
        assert response == {
            'type': 'learning_progress',
            'progress': 50,
            'lesson_id': 1
        }
    finally:
        # Close
        await communicator.disconnect()
