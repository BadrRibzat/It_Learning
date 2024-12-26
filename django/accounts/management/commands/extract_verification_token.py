from django.core.management.base import BaseCommand
from accounts.models import EmailVerificationToken

class Command(BaseCommand):
    help = 'Extract the verification token for a given email'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='Email address of the user')

    def handle(self, *args, **kwargs):
        email = kwargs['email']
        token = EmailVerificationToken.objects.filter(user__email=email).first()
        if token:
            self.stdout.write(token.token)
        else:
            self.stderr.write('No verification token found')
