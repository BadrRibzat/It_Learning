from django.core.management.base import BaseCommand
from accounts.models import User
from lessons.models import Lesson, UserProgress, Level

class Command(BaseCommand):
    help = 'Populate the database with test accounts and initial progress'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('Starting account population...'))
        
        # Clear existing data
        self.clear_existing_data()
        
        # Create test user
        self.create_test_user()
        
        # Create user progress
        self.create_user_progress()
        
        self.stdout.write(self.style.SUCCESS('Account population completed successfully.'))

    def clear_existing_data(self):
        User.objects.filter(username='testuser').delete()
        UserProgress.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Existing data cleared.'))

    def create_test_user(self):
        # Ensure Beginner level exists
        beginner_level, _ = Level.objects.get_or_create(
            name='Beginner', 
            defaults={
                'level_order': 1, 
                'points_to_advance': 100
            }
        )

        # Create user with Beginner level as default
        user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword',
            points=0,
            level=beginner_level  # Always set to Beginner level
        )
        self.stdout.write(self.style.SUCCESS('Successfully created test user with Beginner level.'))
        return user

    def create_user_progress(self):
        try:
            user = User.objects.get(username='testuser')
            lesson = Lesson.objects.first()
            
            if lesson:
                UserProgress.objects.create(
                    user=user,
                    lesson=lesson,
                    completed=False,
                    score=0,
                    total_questions=0,
                    correct_answers=0
                )
                self.stdout.write(self.style.SUCCESS('Successfully created user progress.'))
            else:
                self.stdout.write(self.style.WARNING('No lessons found to create user progress.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error creating user progress: {e}'))
