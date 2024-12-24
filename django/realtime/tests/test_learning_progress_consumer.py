import pytest
from django.test.utils import override_settings
from channels.testing import WebsocketCommunicator
from channels.layers import get_channel_layer
from realtime.consumers import LearningProgressConsumer
from accounts.models import User
from asgiref.sync import sync_to_async

@pytest.fixture
def event_loop():
    import asyncio
    loop = asyncio.get_event_loop()
    yield loop
    loop.close()

@override_settings(CHANNEL_LAYERS={'default': {'BACKEND': 'channels.layers.InMemoryChannelLayer'}})
@pytest.mark.django_db
@pytest.mark.asyncio
async def test_learning_progress_consumer(event_loop):
    channel_layer = get_channel_layer()

    user = await sync_to_async(User.objects.create_user)(
        username='testuser',
        email='test@example.com',
        password='testpassword'
    )

    scope = {
        "type": "websocket",
        "path": "/ws/progress/",
        "headers": [],
        "user": user,
        "query_string": b"",
    }

    application = LearningProgressConsumer.as_asgi(channel_layer=channel_layer)
    communicator = WebsocketCommunicator(application, "/ws/progress/")
    communicator.scope.update(scope)

    connected, _ = await communicator.connect()
    assert connected
