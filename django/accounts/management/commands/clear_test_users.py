from django.core.management.base import BaseCommand
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta
from accounts.models import User, EmailVerificationToken, PasswordResetToken
from lessons.models import (
    UserProgress, UserFlashcardProgress, 
    UserQuizAttempt, UserLevelTestProgress
)

class Command(BaseCommand):
    help = 'Clear test users and associated data'

    def add_arguments(self, parser):
        """
        Add arguments to the command.
        """
        parser.add_argument(
            '--days', 
            type=int, 
            default=7, 
            help='Number of days old to consider for cleanup'
        )

    def handle(self, *args, **options):
        """
        Handle the command to clear test users and associated data.
        """
        days = options['days']
        cutoff_date = timezone.now() - timedelta(days=days)

        # Query for test users
        test_users = User.objects.filter(
            Q(email__startswith='testuser') |
            Q(username__startswith='testuser') |
            Q(email__contains='@example.com')
        ).filter(date_joined__lt=cutoff_date).exclude(is_superuser=True)

        # Count of users to be deleted
        count = test_users.count()

        # Delete associated data
        for user in test_users:
            UserProgress.objects.filter(user=user).delete()
            UserFlashcardProgress.objects.filter(user=user).delete()
            UserQuizAttempt.objects.filter(user=user).delete()
            UserLevelTestProgress.objects.filter(user=user).delete()
            EmailVerificationToken.objects.filter(user=user).delete()
            PasswordResetToken.objects.filter(user=user).delete()

        # Delete users
        test_users.delete()

        self.stdout.write(
            self.style.SUCCESS(f'Successfully deleted {count} test users and their associated data')
        )
