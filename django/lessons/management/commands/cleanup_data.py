from django.core.management.base import BaseCommand
from lessons.models import Level, Lesson, Quiz, Flashcard, UserProgress
from django.db import transaction

class Command(BaseCommand):
    help = 'Clean up all existing learning data'

    def handle(self, *args, **options):
        try:
            with transaction.atomic():
                # Clean up in reverse order of dependencies
                self.stdout.write('Cleaning up user progress...')
                UserProgress.objects.all().delete()

                self.stdout.write('Cleaning up flashcards...')
                Flashcard.objects.all().delete()

                self.stdout.write('Cleaning up quizzes...')
                Quiz.objects.all().delete()

                self.stdout.write('Cleaning up lessons...')
                Lesson.objects.all().delete()

                self.stdout.write('Cleaning up levels...')
                Level.objects.all().delete()

                self.stdout.write(
                    self.style.SUCCESS('Successfully cleaned up all learning data')
                )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error cleaning up data: {str(e)}')
            )
            raise
