from django.test.utils import override_settings
from channels.testing import WebsocketCommunicator
from channels.layers import get_channel_layer
from realtime.consumers import ChatConsumer
from accounts.models import User
from asgiref.sync import sync_to_async
import pytest

@override_settings(CHANNEL_LAYERS={'default': {'BACKEND': 'channels.layers.InMemoryChannelLayer'}})
@pytest.mark.django_db
@pytest.mark.asyncio
async def test_chat_consumer():
    channel_layer = get_channel_layer()

    user = await sync_to_async(User.objects.create_user)(
        username='testuser2',
        email='test2@example.com',
        password='testpassword'
    )

    scope = {
        "type": "websocket",
        "path": "/ws/chat/testroom/",
        "headers": [],
        "user": user,
        "url_route": {
            "kwargs": {
                "room_name": "testroom"
            }
        },
        "query_string": b"",
    }

    application = ChatConsumer.as_asgi(channel_layer=channel_layer)
    communicator = WebsocketCommunicator(application, "/ws/chat/testroom/")
    communicator.scope.update(scope)

    connected, _ = await communicator.connect()
    assert connected
