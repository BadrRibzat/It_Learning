import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from channels.layers import get_channel_layer

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if "url_route" not in self.scope:
            await self.close()
            return

        self.room_name = self.scope["url_route"]["kwargs"].get("room_name")
        if not self.room_name:
            await self.close()
            return

        self.room_group_name = f"chat_{self.room_name}"
        self.user = self.scope.get("user")

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
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json.get('message')
            message_type = text_data_json.get('type')

            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'message_type': message_type
                }
            )
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'error': 'Invalid JSON format'
            }))

    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': event.get('message_type', 'chat_message'),
            'message': event.get('message')
        }))

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

class LearningProgressConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if "url_route" not in self.scope:
            await self.close()
            return

        self.user_id = self.scope["url_route"]["kwargs"].get("user_id")
        if not self.user_id:
            await self.close()
            return

        self.user = self.scope.get("user")
        if not self.user:
            await self.close()
            return

        self.group_name = f"user_{self.user_id}_progress"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            progress = text_data_json.get('progress')
            lesson_id = text_data_json.get('lesson_id')

            # Send progress to group
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'learning_progress',
                    'progress': progress,
                    'lesson_id': lesson_id
                }
            )
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'error': 'Invalid JSON format'
            }))

    async def learning_progress(self, event):
        # Send progress update to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'learning_progress',
            'progress': event.get('progress'),
            'lesson_id': event.get('lesson_id')
        }))
