import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

User = get_user_model()

class LearningProgressConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.room_name = f"user_{self.user.id}_progress"
        self.room_group_name = f"learning_progress_{self.room_name}"

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get("type")
        
        if message_type == "progress_update":
            await self.handle_progress_update(text_data_json)
        elif message_type == "request_statistics":
            await self.handle_statistics_request()

    async def handle_progress_update(self, data):
        # Update user progress in database
        await self.update_user_progress(data)
        
        # Send progress update to group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "progress_update",
                "data": data
            }
        )

    async def progress_update(self, event):
        # Send progress update to WebSocket
        await self.send(text_data=json.dumps(event["data"]))

    @database_sync_to_async
    def update_user_progress(self, data):
        # Update user progress in database
        progress_type = data.get("progress_type")
        if progress_type == "lesson":
            lesson_id = data.get("lesson_id")
            completed = data.get("completed", False)
            # Update lesson progress
            from lessons.models import UserProgress
            UserProgress.objects.update_or_create(
                user=self.user,
                lesson_id=lesson_id,
                defaults={"completed": completed}
            )
        elif progress_type == "quiz":
            quiz_id = data.get("quiz_id")
            score = data.get("score", 0)
            # Update quiz progress
            from lessons.models import UserQuizAttempt
            UserQuizAttempt.objects.create(
                user=self.user,
                quiz_id=quiz_id,
                total_score=score
            )

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"
        self.user = self.scope["user"]

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        username = self.user.username

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "username": username,
            }
        )

    async def chat_message(self, event):
        message = event["message"]
        username = event["username"]

        await self.send(text_data=json.dumps({
            "message": message,
            "username": username,
        }))
