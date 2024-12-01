import pytest
from channels.testing import WebsocketCommunicator
from realtime.consumers import LearningProgressConsumer, ChatConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from accounts.models import User
from lessons.models import Lesson, Level, UserProgress
from asgiref.sync import sync_to_async
from django.contrib.auth.models import AnonymousUser

@pytest.mark.django_db
@pytest.mark.asyncio
async def test_learning_progress_consumer():
    user = await sync_to_async(User.objects.create_user)(
        username='testuser',
        email='test@example.com',
        password='testpassword'
    )
    
    # Create proper scope with user
    scope = {
        "type": "websocket",
        "path": "/ws/progress/",
        "headers": [],
        "user": user,
        "query_string": b"",
    }
    
    application = LearningProgressConsumer.as_asgi()
    communicator = WebsocketCommunicator(
        application,
        "/ws/progress/"
    )
    # Set the scope manually
    communicator.scope.update(scope)
    
    connected, _ = await communicator.connect()
    assert connected

    # Send a message to the consumer
    await communicator.send_json_to({
        "type": "progress_update",
        "data": {
            "progress_type": "lesson",
            "lesson_id": 1,
            "completed": True,
            "points_earned": 10,
            "total_points": 10
        }
    })

    # Receive a message from the consumer
    response = await communicator.receive_json_from()
    assert response["data"]["progress_type"] == "lesson"

    await communicator.disconnect()

@pytest.mark.django_db
@pytest.mark.asyncio
async def test_chat_consumer():
    user = await sync_to_async(User.objects.create_user)(
        username='testuser2',
        email='test2@example.com',
        password='testpassword'
    )
    
    # Create proper scope with user and URL route
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
    
    application = ChatConsumer.as_asgi()
    communicator = WebsocketCommunicator(
        application,
        "/ws/chat/testroom/"
    )
    # Set the scope manually
    communicator.scope.update(scope)
    
    connected, _ = await communicator.connect()
    assert connected

    # Send a message to the consumer
    await communicator.send_json_to({
        "message": "Hello, world!"
    })

    # Receive a message from the consumer
    response = await communicator.receive_json_from()
    assert response["message"] == "Hello, world!"

    await communicator.disconnect()
