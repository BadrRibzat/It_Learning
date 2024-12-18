from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

# Get the User model
User = get_user_model()

class Command(BaseCommand):
    help = 'Clean up all existing users'

    def handle(self, *args, **kwargs):
        """
        Handle the command to clean up all existing users.
        """
        User.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Successfully cleaned up all users'))
