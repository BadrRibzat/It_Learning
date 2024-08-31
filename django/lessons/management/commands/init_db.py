from django.core.management.base import BaseCommand
from lessons.models import Lesson, Test
from flashcards.models import Flashcard

class Command(BaseCommand):
    help = 'Initialize database with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Initializing database...')

        # Sample data for lessons, tests, and flashcards
        levels = ['beginner', 'intermediate', 'advanced']
        lessons_data = [
            # Beginner level
            {"title": "Greetings and Introductions", "level": "beginner", "order": 1},
            {"title": "Numbers and Counting", "level": "beginner", "order": 2},
            {"title": "Colors and Shapes", "level": "beginner", "order": 3},
            {"title": "Family Members", "level": "beginner", "order": 4},
            {"title": "Days of the Week", "level": "beginner", "order": 5},
            {"title": "Basic Verbs", "level": "beginner", "order": 6},
            {"title": "Simple Present Tense", "level": "beginner", "order": 7},
            {"title": "Weather and Seasons", "level": "beginner", "order": 8},
            {"title": "Food and Drinks", "level": "beginner", "order": 9},
            {"title": "Clothing Items", "level": "beginner", "order": 10},
            
            # Intermediate level
            {"title": "Past Tense Verbs", "level": "intermediate", "order": 1},
            {"title": "Future Tense", "level": "intermediate", "order": 2},
            {"title": "Comparative Adjectives", "level": "intermediate", "order": 3},
            {"title": "Prepositions of Place", "level": "intermediate", "order": 4},
            {"title": "Conjunctions", "level": "intermediate", "order": 5},
            {"title": "Adverbs of Frequency", "level": "intermediate", "order": 6},
            {"title": "Modal Verbs", "level": "intermediate", "order": 7},
            {"title": "Phrasal Verbs", "level": "intermediate", "order": 8},
            {"title": "Conditional Sentences", "level": "intermediate", "order": 9},
            {"title": "Passive Voice", "level": "intermediate", "order": 10},
            
            # Advanced level
            {"title": "Idiomatic Expressions", "level": "advanced", "order": 1},
            {"title": "Advanced Grammar Structures", "level": "advanced", "order": 2},
            {"title": "Academic Vocabulary", "level": "advanced", "order": 3},
            {"title": "Complex Sentence Structures", "level": "advanced", "order": 4},
            {"title": "Rhetorical Devices", "level": "advanced", "order": 5},
            {"title": "Professional Writing Skills", "level": "advanced", "order": 6},
            {"title": "Cultural References in English", "level": "advanced", "order": 7},
            {"title": "English Literature Analysis", "level": "advanced", "order": 8},
            {"title": "Debate and Argumentation", "level": "advanced", "order": 9},
            {"title": "Research and Academic Writing", "level": "advanced", "order": 10},
        ]

        for lesson_data in lessons_data:
            lesson = Lesson.objects.create(**lesson_data)
            
            # Create a test for each lesson
            test_questions = [
                {"question": f"Sample question 1 for {lesson.title}", "options": ["A", "B", "C", "D"], "correct_answer": "A"},
                {"question": f"Sample question 2 for {lesson.title}", "options": ["A", "B", "C", "D"], "correct_answer": "B"},
                # Add more questions as needed
            ]
            Test.objects.create(lesson=lesson, questions=test_questions)
            
            # Create flashcards for each lesson
            for i in range(1, 11):  # 10 flashcards per lesson
                Flashcard.objects.create(
                    word=f"Word {i} for {lesson.title}",
                    question=f"What is the meaning of Word {i}?",
                    correct_answer=f"Meaning of Word {i}",
                    level=lesson.level,
                    lesson=lesson
                )

        self.stdout.write(self.style.SUCCESS('Database initialized successfully'))
