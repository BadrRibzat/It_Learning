from django.core.management.base import BaseCommand
from chatbot.train_model import train_model, download_resources

class Command(BaseCommand):
    help = 'Train the chatbot model'

    def handle(self, *args, **kwargs):
        # Download necessary resources first
        self.stdout.write('Downloading resources...')
        download_resources()
        
        # Train the model
        self.stdout.write('Starting chatbot model training...')
        model = train_model()
        
        if model:
            self.stdout.write(self.style.SUCCESS('Chatbot model training completed successfully.'))
        else:
            self.stdout.write(self.style.ERROR('Chatbot model training failed.'))
