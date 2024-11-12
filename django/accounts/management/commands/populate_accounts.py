from django.core.management.base import BaseCommand
from accounts.models import User
from lessons.models import Lesson, UserProgress

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
        User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword',
            points=0,
            level=1
        )
        self.stdout.write(self.style.SUCCESS('Successfully created test user.'))

    def create_user_progress(self):
        user = User.objects.get(username='testuser')
        lesson = Lesson.objects.first()
        UserProgress.objects.create(
            user=user,
            lesson=lesson,
            completed=False,
            score=0,
            total_questions=0,
            correct_answers=0
        )
        self.stdout.write(self.style.SUCCESS('Successfully created user progress.'))
