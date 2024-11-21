from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from lessons.models import Level
import time

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate the database with test accounts'

    def handle(self, *args, **kwargs):
        try:
            beginner_level, _ = Level.objects.get_or_create(
                name='Beginner',
                defaults={
                    'position': 1,
                    'points_to_advance': 100,
                    'difficulty': 'beginner'
                }
            )

            timestamp = int(time.time())
            username = f'testuser_{timestamp}'
            email = f'{username}@example.com'

            try:
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password='TestPassword123!',
                    level=beginner_level,
                    language='en'
                )

                self.stdout.write(
                    self.style.SUCCESS(f'Successfully created test user: {username}')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error creating test user: {str(e)}')
                )

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Population error: {e}'))
