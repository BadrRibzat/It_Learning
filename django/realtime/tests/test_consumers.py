import pytest
from channels.testing import WebsocketCommunicator
from realtime.consumers import ChatConsumer
from django.test import override_settings

@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
@override_settings(CHANNEL_LAYERS={'default': {'BACKEND': 'channels.layers.InMemoryChannelLayer'}})
async def test_chat_consumer(auth_communicator, test_user):
    # Create communicator
    communicator, user = await auth_communicator(
        ChatConsumer,
        f"/ws/chat/{test_user.id}/"
    )

    try:
        # Test sending message
        await communicator.send_json_to({
            'type': 'chat_message',
            'message': 'hello'
        })

        # Test receiving message
        response = await communicator.receive_json_from()
        assert response == {
            'type': 'chat_message',
            'message': 'hello'
        }
    finally:
        await communicator.disconnect()
