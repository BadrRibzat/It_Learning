from django.core.management.base import BaseCommand
from django.db import ProgrammingError, connection
from chatbot.models import ChatbotResponse

class Command(BaseCommand):
    help = 'Populate the database with initial chatbot responses'

    def handle(self, *args, **kwargs):
        self.ensure_table_exists()
        self.clear_existing_responses()
        self.create_chatbot_responses()
        self.stdout.write(self.style.SUCCESS('New chatbot responses created successfully.'))

    def ensure_table_exists(self):
        try:
            # Try to access the table to see if it exists
            ChatbotResponse.objects.exists()
        except ProgrammingError:
            # If a ProgrammingError is raised, the table does not exist
            self.stdout.write(self.style.WARNING('Creating chatbot_chatbotresponse table...'))
            with connection.schema_editor() as schema_editor:
                schema_editor.create_model(ChatbotResponse)
            self.stdout.write(self.style.SUCCESS('chatbot_chatbotresponse table created.'))

    def clear_existing_responses(self):
        try:
            self.stdout.write(self.style.WARNING('Clearing existing chatbot responses...'))
            ChatbotResponse.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Existing chatbot responses cleared.'))
        except ProgrammingError as e:
            self.stdout.write(self.style.WARNING('Error while clearing responses. Continuing...'))

    def create_chatbot_responses(self):
        self.stdout.write(self.style.WARNING('Creating new chatbot responses...'))
        responses = [
            {'input': 'Hello', 'response': 'Hi there! How can I help you today?'},
            {'input': 'How are you?', 'response': 'I\'m just a bot, but thanks for asking! How can I assist you?'},
            {'input': 'What is your name?', 'response': 'I\'m the Language Learning Chatbot. How can I assist you?'},
            {'input': 'Can you help me with English?', 'response': 'Of course! What do you need help with? Vocabulary, grammar, or something else?'},
            {'input': 'Tell me a joke', 'response': 'Why don\'t scientists trust atoms? Because they make up everything!'},
            {'input': 'Goodbye', 'response': 'Goodbye! Have a great day!'},
        ]
        for response_data in responses:
            try:
                ChatbotResponse.objects.create(
                    input_text=response_data['input'],
                    response_text=response_data['response']
                )
                self.stdout.write(f'Created chatbot response for input: {response_data["input"]}')
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error creating response for input: {response_data["input"]}. Error: {str(e)}'))
