from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from lessons.models import Lesson, Flashcard, Quiz, LevelTest, UserQuizAttempt, UserFlashcardProgress, UserLevelProgress
from accounts.utils import ensure_schema

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate the database with initial data for accounts'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before populating',
        )

    def handle(self, *args, **options):
        ensure_schema()  # Ensure database schema is up-to-date
        
        # Always clear existing data
        self.clear_existing_data()
        
        self.populate_data()

    def clear_existing_data(self):
        self.stdout.write("Clearing existing data...")
        User.objects.all().delete()
        UserFlashcardProgress.objects.all().delete()
        UserLevelProgress.objects.all().delete()
        UserQuizAttempt.objects.all().delete()
        self.stdout.write(self.style.SUCCESS("Existing data cleared."))

    def populate_data(self):
        self.create_test_user()
        self.create_user_progress()
        self.create_gamification_system()
        self.create_review_mechanism()
        self.create_personalized_review_sessions()
        self.stdout.write(self.style.SUCCESS('New account data created successfully.'))

    def create_test_user(self):
        first_lesson = Lesson.objects.first()
        if not first_lesson:
            self.stdout.write(self.style.WARNING("No lessons found. Please run populate_lessons first."))
            return

        user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword',
            is_active=True,
            bio='Test user bio',
            date_of_birth='1990-01-01',
            points=0,
            level=1,
            language='en',
            current_lesson=first_lesson
        )
        self.stdout.write(self.style.SUCCESS(f'Successfully created test user with current lesson: {first_lesson}'))

    def create_user_progress(self):
        user = User.objects.first()
        if not user:
            self.stdout.write(self.style.WARNING('No users found. Skipping user progress creation.'))
            return

        lessons = Lesson.objects.all()
        for lesson in lessons:
            flashcards = Flashcard.objects.filter(lesson=lesson)
            for flashcard in flashcards:
                UserFlashcardProgress.objects.create(user=user, flashcard=flashcard, completed=False, correct_attempts=0)

        levels = LevelTest.objects.all()
        for level in levels:
            UserLevelProgress.objects.create(user=user, level=level.level, completed=False)

        self.stdout.write(self.style.SUCCESS('Successfully created user progress data'))

    def create_gamification_system(self):
        user = User.objects.first()
        if not user:
            self.stdout.write(self.style.WARNING('No users found. Skipping gamification system creation.'))
            return

        quizzes = Quiz.objects.all()
        for quiz in quizzes:
            UserQuizAttempt.objects.create(user=user, quiz=quiz, score=0)

        self.stdout.write(self.style.SUCCESS('Successfully created gamification system'))

    def create_review_mechanism(self):
        user = User.objects.first()
        if not user:
            self.stdout.write(self.style.WARNING('No users found. Skipping review mechanism creation.'))
            return

        lessons = Lesson.objects.all()
        for lesson in lessons:
            review_flashcards = Flashcard.objects.filter(lesson__level__level_order__lt=lesson.level.level_order)
            for review_flashcard in review_flashcards:
                UserFlashcardProgress.objects.create(user=user, flashcard=review_flashcard, completed=False, correct_attempts=0)

        self.stdout.write(self.style.SUCCESS('Successfully created review mechanism'))

    def create_personalized_review_sessions(self):
        user = User.objects.first()
        if not user:
            self.stdout.write(self.style.WARNING('No users found. Skipping personalized review sessions creation.'))
            return

        flashcards = Flashcard.objects.all()
        for flashcard in flashcards:
            UserFlashcardProgress.objects.create(user=user, flashcard=flashcard, completed=False, correct_attempts=0)

        self.stdout.write(self.style.SUCCESS('Successfully created personalized review sessions'))
