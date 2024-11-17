from django.core.management.base import BaseCommand
from django.db import connection, transaction
from django.db.utils import ProgrammingError
from lessons.utils import ensure_schema_compatibility
from django.db.models import F, Q
from lessons.models import (
        Level,
        Lesson,
        Flashcard,
        Quiz,
        QuizQuestion,
        LevelTest,
        LevelTestQuestion
        )
from accounts.models import User
import random
import string
import re
import logging
import nltk
from nltk.corpus import wordnet
from django.core.exceptions import ValidationError

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Populate the database with comprehensive lesson data'

    def handle(self, *args, **kwargs):
        try:
            # Ensure schema compatibility before population
            ensure_schema_compatibility()

            self.stdout.write(self.style.SUCCESS('Schema compatibility ensured.'))

            # Ensure all necessary migrations are applied
            self.apply_migrations()

            with transaction.atomic():
                self.stdout.write(self.style.WARNING('Starting database population...'))

                # Clear existing content
                self.clear_existing_content()

                # Create levels
                self.create_levels()

                # Create lessons
                self.create_lessons()

                self.stdout.write(self.style.SUCCESS('Database population completed successfully.'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error during population: {str(e)}'))
            logger.error(f'Population error: {e}', exc_info=True)

    def apply_migrations(self):
        """
        Ensure all necessary columns and tables exist
        """
        try:
            with connection.cursor() as cursor:
                # Check and add points_to_complete column to Lesson model
                cursor.execute("""
                DO $$
                BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_name = 'lessons_lesson'
                    AND column_name = 'points_to_complete'
                ) THEN
                    ALTER TABLE lessons_lesson
                    ADD COLUMN points_to_complete INTEGER DEFAULT 50;
                END IF;
                END $$;
                """)

                # Check and add points_to_advance column to Level model
                cursor.execute("""
                DO $$
                BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_name = 'lessons_level'
                    AND column_name = 'points_to_advance'
                ) THEN
                    ALTER TABLE lessons_level
                    ADD COLUMN points_to_advance INTEGER DEFAULT 100;
                END IF;
                END $$;
                """)

                # Check and add unlocked_by_test column to Level model
                cursor.execute("""
                DO $$
                BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_name = 'lessons_level'
                    AND column_name = 'unlocked_by_test'
                ) THEN
                    ALTER TABLE lessons_level
                    ADD COLUMN unlocked_by_test BOOLEAN DEFAULT FALSE;
                END IF;
                END $$;
                """)

                self.stdout.write(self.style.SUCCESS('Database schema verified and updated successfully.'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Migration error: {str(e)}'))
            logger.error(f'Migration error: {e}', exc_info=True)

    def clear_existing_content(self):
        """
        Safely clear existing content from lesson-related tables
        """
        tables = [
            'lessons_leveltestquestion',
            'lessons_leveltest',
            'lessons_quizquestion',
            'lessons_quiz',
            'lessons_flashcard',
            'lessons_lesson',
            'lessons_level'
        ]

        try:
            with connection.cursor() as cursor:
                for table in tables:
                    cursor.execute(f"TRUNCATE TABLE {table} RESTART IDENTITY CASCADE;")
                logger.info(f"Cleared table: {table}")

            self.stdout.write(self.style.SUCCESS('Existing content cleared.'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Content clearing error: {str(e)}'))
            logger.error(f'Content clearing error: {e}', exc_info=True)

    def create_levels(self):
        """
        Create predefined levels with points_to_advance
        """
        levels = [
            {'name': 'Beginner', 'level_order': 1, 'points_to_advance': 100, 'unlocked_by_test': False},
            {'name': 'Intermediate', 'level_order': 2, 'points_to_advance': 250, 'unlocked_by_test': True},
            {'name': 'Advanced', 'level_order': 3, 'points_to_advance': 500, 'unlocked_by_test': True},
        ]

        for level_data in levels:
            try:
                # Use get_or_create to avoid duplicates
                level, created = Level.objects.get_or_create(
                    name=level_data['name'],
                    defaults={
                        'level_order': level_data['level_order'],
                        'points_to_advance': level_data['points_to_advance'],
                        'unlocked_by_test': level_data['unlocked_by_test']
                    }
                )

                # Update existing level if needed
                if not created:
                    level.level_order = level_data['level_order']
                    level.points_to_advance = level_data['points_to_advance']
                    level.unlocked_by_test = level_data['unlocked_by_test']
                    level.save()

                logger.info(f"{'Created' if created else 'Updated'} level: {level_data['name']}")

            except Exception as e:
                logger.error(f"Error creating/updating level {level_data['name']}: {e}")

    def create_lessons(self):
        """
        Create lessons for each level
        """
        levels = Level.objects.all()
        lesson_generators = {
            'Beginner': self.generate_beginner_lessons,
            'Intermediate': self.generate_intermediate_lessons,
            'Advanced': self.generate_advanced_lessons
        }

        for level in levels:
            lesson_generator = lesson_generators.get(level.name)
            if lesson_generator:
                lesson_generator(level)

    def generate_beginner_lessons(self, level):
        lessons_data = [
            {
                'title': 'Basic Greetings',
                'content': 'Learn essential greeting phrases in English',
                'difficulty': 'beginner',
                'flashcards': [
                    {
                        'word': 'Hello',
                        'definition': 'A common greeting used to say hi',
                        'example': 'Hello, how are you today?',
                        'translation': 'مرحبا'
                    },
                    {
                        'word': 'Goodbye',
                        'definition': 'A farewell expression',
                        'example': 'Goodbye, see you later!',
                        'translation': 'وداعا'
                    },
                    {
                        'word': 'Yes',
                        'definition': 'A word used to express agreement or affirmation',
                        'example': 'Do you like ice cream? Yes, I do.',
                        'translation': 'نعم'
                    },
                    {
                        'word': 'No',
                        'definition': 'A word used to express disagreement or negation',
                        'example': 'Is it raining outside? No, it is not.',
                        'translation': 'لا'
                    },
                    {
                        'word': 'Please',
                        'definition': 'A word used to make a request polite',
                        'example': 'Can you pass the salt, please?',
                        'translation': 'من فضلك'
                    },
                    {
                        'word': 'Thank you',
                        'definition': 'A phrase used to express gratitude',
                        'example': 'Thank you for your help.',
                        'translation': 'شكرا لك'
                    },
                    {
                        'word': 'Excuse me',
                        'definition': 'A phrase used to get someone’s attention politely',
                        'example': 'Excuse me, where is the restroom?',
                        'translation': 'عفوا'
                    },
                    {
                        'word': 'Sorry',
                        'definition': 'A word used to express regret or apology',
                        'example': 'Sorry, I didn’t mean to bump into you.',
                        'translation': 'آسف'
                    },
                    {
                        'word': 'Welcome',
                        'definition': 'A word used to greet someone or express acceptance',
                        'example': 'Welcome to our home.',
                        'translation': 'مرحبا بك'
                    },
                    {
                        'word': 'How are you?',
                        'definition': 'A common greeting to ask about someone’s well-being',
                        'example': 'How are you? I am fine, thank you.',
                        'translation': 'كيف حالك؟'
                    },
                ]
            },
            {
                'title': 'Basic Numbers',
                'content': 'Learn to count from 1 to 10 in English',
                'difficulty': 'beginner',
                'flashcards': [
                    {
                        'word': 'One',
                        'definition': 'The number 1',
                        'example': 'I have one apple.',
                        'translation': 'واحد'
                    },
                    {
                        'word': 'Two',
                        'definition': 'The number 2',
                        'example': 'There are two books on the table.',
                        'translation': 'اثنان'
                    },
                    {
                        'word': 'Three',
                        'definition': 'The number 3',
                        'example': 'She has three cats.',
                        'translation': 'ثلاثة'
                    },
                    {
                        'word': 'Four',
                        'definition': 'The number 4',
                        'example': 'We need four chairs.',
                        'translation': 'أربعة'
                    },
                    {
                        'word': 'Five',
                        'definition': 'The number 5',
                        'example': 'Five friends came to the party.',
                        'translation': 'خمسة'
                    },
                    {
                        'word': 'Six',
                        'definition': 'The number 6',
                        'example': 'He bought six eggs.',
                        'translation': 'ستة'
                    },
                    {
                        'word': 'Seven',
                        'definition': 'The number 7',
                        'example': 'Seven days make a week.',
                        'translation': 'سبعة'
                    },
                    {
                        'word': 'Eight',
                        'definition': 'The number 8',
                        'example': 'There are eight planets in our solar system.',
                        'translation': 'ثمانية'
                    },
                    {
                        'word': 'Nine',
                        'definition': 'The number 9',
                        'example': 'Nine months make a pregnancy.',
                        'translation': 'تسعة'
                    },
                    {
                        'word': 'Ten',
                        'definition': 'The number 10',
                        'example': 'Ten fingers and ten toes.',
                        'translation': 'عشرة'
                    },
                ]
            },
            {
                'title': 'Basic Colors',
                'content': 'Learn basic colors in English',
                'difficulty': 'beginner',
                'flashcards': [
                    {
                        'word': 'Red',
                        'definition': 'A color like that of blood or a ripe tomato',
                        'example': 'The apple is red.',
                        'translation': 'أحمر'
                    },
                    {
                        'word': 'Blue',
                        'definition': 'A color like that of the sky on a clear day',
                        'example': 'The sky is blue.',
                        'translation': 'أزرق'
                    },
                    {
                        'word': 'Green',
                        'definition': 'A color like that of grass or leaves',
                        'example': 'The grass is green.',
                        'translation': 'أخضر'
                    },
                    {
                        'word': 'Yellow',
                        'definition': 'A color like that of ripe lemons or the sun',
                        'example': 'The banana is yellow.',
                        'translation': 'أصفر'
                    },
                    {
                        'word': 'Black',
                        'definition': 'A very dark color',
                        'example': 'The cat is black.',
                        'translation': 'أسود'
                    },
                    {
                        'word': 'White',
                        'definition': 'A very light color',
                        'example': 'The snow is white.',
                        'translation': 'أبيض'
                    },
                    {
                        'word': 'Orange',
                        'definition': 'A color like that of ripe oranges',
                        'example': 'The carrot is orange.',
                        'translation': 'برتقالي'
                    },
                    {
                        'word': 'Purple',
                        'definition': 'A color that is a mixture of red and blue',
                        'example': 'The grapes are purple.',
                        'translation': 'بنفسجي'
                    },
                    {
                        'word': 'Brown',
                        'definition': 'A color like that of wood or chocolate',
                        'example': 'The tree trunk is brown.',
                        'translation': 'بني'
                    },
                    {
                        'word': 'Pink',
                        'definition': 'A light red color',
                        'example': 'The flower is pink.',
                        'translation': 'وردي'
                    },
                ]
            },
            {
                'title': 'Basic Family Members',
                'content': 'Learn basic family members in English',
                'difficulty': 'beginner',
                'flashcards': [
                    {
                        'word': 'Mother',
                        'definition': 'A female parent',
                        'example': 'My mother is very kind.',
                        'translation': 'أم'
                    },
                    {
                        'word': 'Father',
                        'definition': 'A male parent',
                        'example': 'My father is very strong.',
                        'translation': 'أب'
                    },
                    {
                        'word': 'Sister',
                        'definition': 'A female sibling',
                        'example': 'I have two sisters.',
                        'translation': 'أخت'
                    },
                    {
                        'word': 'Brother',
                        'definition': 'A male sibling',
                        'example': 'I have one brother.',
                        'translation': 'أخ'
                    },
                    {
                        'word': 'Grandmother',
                        'definition': 'A mother of one’s parent',
                        'example': 'My grandmother is very wise.',
                        'translation': 'جدة'
                    },
                    {
                        'word': 'Grandfather',
                        'definition': 'A father of one’s parent',
                        'example': 'My grandfather is very kind.',
                        'translation': 'جد'
                    },
                    {
                        'word': 'Aunt',
                        'definition': 'The sister of one’s parent',
                        'example': 'My aunt is very funny.',
                        'translation': 'عمة'
                    },
                    {
                        'word': 'Uncle',
                        'definition': 'The brother of one’s parent',
                        'example': 'My uncle is very generous.',
                        'translation': 'عم'
                    },
                    {
                        'word': 'Cousin',
                        'definition': 'A child of one’s uncle or aunt',
                        'example': 'I have many cousins.',
                        'translation': 'ابن عم أو ابن عمة'
                    },
                    {
                        'word': 'Niece',
                        'definition': 'A daughter of one’s sibling',
                        'example': 'My niece is very cute.',
                        'translation': 'ابنة أخ أو أخت'
                    },
                ]
            },
            {
                'title': 'Basic Days of the Week',
                'content': 'Learn the days of the week in English',
                'difficulty': 'beginner',
                'flashcards': [
                    {
                        'word': 'Monday',
                        'definition': 'The day of the week after Sunday and before Tuesday',
                        'example': 'I have a meeting on Monday.',
                        'translation': 'الاثنين'
                    },
                    {
                        'word': 'Tuesday',
                        'definition': 'The day of the week after Monday and before Wednesday',
                        'example': 'I go to the gym on Tuesday.',
                        'translation': 'الثلاثاء'
                    },
                    {
                        'word': 'Wednesday',
                        'definition': 'The day of the week after Tuesday and before Thursday',
                        'example': 'I have a class on Wednesday.',
                        'translation': 'الأربعاء'
                    },
                    {
                        'word': 'Thursday',
                        'definition': 'The day of the week after Wednesday and before Friday',
                        'example': 'I have a party on Thursday.',
                        'translation': 'الخميس'
                    },
                    {
                        'word': 'Friday',
                        'definition': 'The day of the week after Thursday and before Saturday',
                        'example': 'I relax on Friday.',
                        'translation': 'الجمعة'
                    },
                    {
                        'word': 'Saturday',
                        'definition': 'The day of the week after Friday and before Sunday',
                        'example': 'I go shopping on Saturday.',
                        'translation': 'السبت'
                    },
                    {
                        'word': 'Sunday',
                        'definition': 'The day of the week after Saturday and before Monday',
                        'example': 'I go to church on Sunday.',
                        'translation': 'الأحد'
                    },
                    {
                        'word': 'Weekend',
                        'definition': 'Saturday and Sunday',
                        'example': 'I enjoy the weekend.',
                        'translation': 'عطلة نهاية الأسبوع'
                    },
                    {
                        'word': 'Weekday',
                        'definition': 'Any day of the week except Saturday and Sunday',
                        'example': 'I work on weekdays.',
                        'translation': 'يوم عمل'
                    },
                    {
                        'word': 'Today',
                        'definition': 'The present day',
                        'example': 'I am studying today.',
                        'translation': 'اليوم'
                    },
                ]
            },
        ]

        self.create_lessons_with_flashcards(level, lessons_data)

    def generate_intermediate_lessons(self, level):
        lessons_data = [
            {
                'title': 'Present Continuous Tense',
                'content': 'Learn to use present continuous tense',
                'difficulty': 'intermediate',
                'flashcards': [
                    {
                        'word': 'Reading',
                        'definition': 'The act of looking at and understanding written text',
                        'example': 'I am reading an interesting book right now.',
                        'translation': 'يقرأ'
                    },
                    {
                        'word': 'Writing',
                        'definition': 'The act of putting thoughts into written words',
                        'example': 'She is writing a letter to her friend.',
                        'translation': 'يكتب'
                    },
                    {
                        'word': 'Running',
                        'definition': 'The act of moving quickly on foot',
                        'example': 'He is running in the park every morning.',
                        'translation': 'يركض'
                    },
                    {
                        'word': 'Cooking',
                        'definition': 'The act of preparing food by mixing ingredients',
                        'example': 'They are cooking dinner for their guests.',
                        'translation': 'يطبخ'
                    },
                    {
                        'word': 'Listening',
                        'definition': 'The act of paying attention to sound',
                        'example': 'She is listening to music while working.',
                        'translation': 'يستمع'
                    },
                    {
                        'word': 'Talking',
                        'definition': 'The act of expressing thoughts and feelings by speaking',
                        'example': 'They are talking about their vacation plans.',
                        'translation': 'يتحدث'
                    },
                    {
                        'word': 'Swimming',
                        'definition': 'The act of moving through water by using limbs',
                        'example': 'He is swimming in the pool to stay fit.',
                        'translation': 'يسبح'
                    },
                    {
                        'word': 'Driving',
                        'definition': 'The act of controlling a vehicle to transport oneself or others',
                        'example': 'She is driving to work every day.',
                        'translation': 'يقود'
                    },
                    {
                        'word': 'Eating',
                        'definition': 'The act of consuming food',
                        'example': 'They are eating lunch at the restaurant.',
                        'translation': 'يأكل'
                    },
                    {
                        'word': 'Sleeping',
                        'definition': 'The act of resting the body and mind by closing the eyes',
                        'example': 'He is sleeping in his room right now.',
                        'translation': 'ينام'
                    },
                ]
            },
            {
                'title': 'Past Simple Tense',
                'content': 'Learn to use past simple tense',
                'difficulty': 'intermediate',
                'flashcards': [
                    {
                        'word': 'Walked',
                        'definition': 'To move at a moderate pace by lifting and setting down each foot in turn',
                        'example': 'I walked to the store yesterday.',
                        'translation': 'مشى'
                    },
                    {
                        'word': 'Read',
                        'definition': 'To look at and understand the meaning of written or printed words',
                        'example': 'She read a book last night.',
                        'translation': 'قرأ'
                    },
                    {
                        'word': 'Wrote',
                        'definition': 'To form letters, words, or symbols on a surface with a pen, pencil, or other writing tool',
                        'example': 'He wrote a letter to his friend.',
                        'translation': 'كتب'
                    },
                    {
                        'word': 'Ran',
                        'definition': 'To move swiftly on foot so that both feet are not on the ground at the same time',
                        'example': 'They ran to catch the bus.',
                        'translation': 'ركض'
                    },
                    {
                        'word': 'Cooked',
                        'definition': 'To prepare food by heating it',
                        'example': 'She cooked dinner for her family.',
                        'translation': 'طبخ'
                    },
                    {
                        'word': 'Listened',
                        'definition': 'To pay attention to sound',
                        'example': 'He listened to the radio all morning.',
                        'translation': 'استمع'
                    },
                    {
                        'word': 'Talked',
                        'definition': 'To express thoughts and feelings by speaking',
                        'example': 'They talked about their plans for the weekend.',
                        'translation': 'تحدث'
                    },
                    {
                        'word': 'Swam',
                        'definition': 'To move through water by using limbs',
                        'example': 'She swam in the ocean yesterday.',
                        'translation': 'سبح'
                    },
                    {
                        'word': 'Drove',
                        'definition': 'To control a vehicle to transport oneself or others',
                        'example': 'He drove to the city last weekend.',
                        'translation': 'قاد'
                    },
                    {
                        'word': 'Ate',
                        'definition': 'To consume food',
                        'example': 'They ate dinner at the restaurant.',
                        'translation': 'أكل'
                    },
                ]
            },
            {
                'title': 'Future Simple Tense',
                'content': 'Learn to use future simple tense',
                'difficulty': 'intermediate',
                'flashcards': [
                    {
                        'word': 'Will walk',
                        'definition': 'To move at a moderate pace by lifting and setting down each foot in turn in the future',
                        'example': 'I will walk to the store tomorrow.',
                        'translation': 'سوف يمشي'
                    },
                    {
                        'word': 'Will read',
                        'definition': 'To look at and understand the meaning of written or printed words in the future',
                        'example': 'She will read a book next week.',
                        'translation': 'سوف تقرأ'
                    },
                    {
                        'word': 'Will write',
                        'definition': 'To form letters, words, or symbols on a surface with a pen, pencil, or other writing tool in the future',
                        'example': 'He will write a letter to his friend next month.',
                        'translation': 'سوف يكتب'
                    },
                    {
                        'word': 'Will run',
                        'definition': 'To move swiftly on foot so that both feet are not on the ground at the same time in the future',
                        'example': 'They will run to catch the bus tomorrow.',
                        'translation': 'سوف يركض'
                    },
                    {
                        'word': 'Will cook',
                        'definition': 'To prepare food by heating it in the future',
                        'example': 'She will cook dinner for her family next weekend.',
                        'translation': 'سوف تطبخ'
                    },
                    {
                        'word': 'Will listen',
                        'definition': 'To pay attention to sound in the future',
                        'example': 'He will listen to the radio tomorrow morning.',
                        'translation': 'سوف يستمع'
                    },
                    {
                        'word': 'Will talk',
                        'definition': 'To express thoughts and feelings by speaking in the future',
                        'example': 'They will talk about their plans for the weekend next week.',
                        'translation': 'سوف يتحدث'
                    },
                    {
                        'word': 'Will swim',
                        'definition': 'To move through water by using limbs in the future',
                        'example': 'She will swim in the ocean next summer.',
                        'translation': 'سوف تسبح'
                    },
                    {
                        'word': 'Will drive',
                        'definition': 'To control a vehicle to transport oneself or others in the future',
                        'example': 'He will drive to the city next weekend.',
                        'translation': 'سوف يقود'
                    },
                    {
                        'word': 'Will eat',
                        'definition': 'To consume food in the future',
                        'example': 'They will eat dinner at the restaurant tomorrow night.',
                        'translation': 'سوف يأكل'
                    },
                ]
            },
            {
                'title': 'Present Perfect Tense',
                'content': 'Learn to use present perfect tense',
                'difficulty': 'intermediate',
                'flashcards': [
                    {
                        'word': 'Have walked',
                        'definition': 'To move at a moderate pace by lifting and setting down each foot in turn in the past with a connection to the present',
                        'example': 'I have walked to the store many times.',
                        'translation': 'مشى'
                    },
                    {
                        'word': 'Have read',
                        'definition': 'To look at and understand the meaning of written or printed words in the past with a connection to the present',
                        'example': 'She has read that book before.',
                        'translation': 'قرأ'
                    },
                    {
                        'word': 'Have written',
                        'definition': 'To form letters, words, or symbols on a surface with a pen, pencil, or other writing tool in the past with a connection to the present',
                        'example': 'He has written a letter to his friend.',
                        'translation': 'كتب'
                    },
                    {
                        'word': 'Have run',
                        'definition': 'To move swiftly on foot so that both feet are not on the ground at the same time in the past with a connection to the present',
                        'example': 'They have run to catch the bus many times.',
                        'translation': 'ركض'
                    },
                    {
                        'word': 'Have cooked',
                        'definition': 'To prepare food by heating it in the past with a connection to the present',
                        'example': 'She has cooked dinner for her family many times.',
                        'translation': 'طبخ'
                    },
                    {
                        'word': 'Have listened',
                        'definition': 'To pay attention to sound in the past with a connection to the present',
                        'example': 'He has listened to the radio many times.',
                        'translation': 'استمع'
                    },
                    {
                        'word': 'Have talked',
                        'definition': 'To express thoughts and feelings by speaking in the past with a connection to the present',
                        'example': 'They have talked about their plans for the weekend many times.',
                        'translation': 'تحدث'
                    },
                    {
                        'word': 'Have swam',
                        'definition': 'To move through water by using limbs in the past with a connection to the present',
                        'example': 'She has swam in the ocean many times.',
                        'translation': 'سبح'
                    },
                    {
                        'word': 'Have drove',
                        'definition': 'To control a vehicle to transport oneself or others in the past with a connection to the present',
                        'example': 'He has drove to the city many times.',
                        'translation': 'قاد'
                    },
                    {
                        'word': 'Have ate',
                        'definition': 'To consume food in the past with a connection to the present',
                        'example': 'They have ate dinner at the restaurant many times.',
                        'translation': 'أكل'
                    },
                ]
            },
            {
                'title': 'Modal Verbs',
                'content': 'Learn to use modal verbs',
                'difficulty': 'intermediate',
                'flashcards': [
                    {
                        'word': 'Can',
                        'definition': 'Used to express ability or permission',
                        'example': 'I can swim.',
                        'translation': 'يمكن'
                    },
                    {
                        'word': 'Could',
                        'definition': 'Past form of can, used to express ability or permission in the past',
                        'example': 'I could swim when I was five.',
                        'translation': 'كان يمكن'
                    },
                    {
                        'word': 'May',
                        'definition': 'Used to express possibility or permission',
                        'example': 'May I go to the bathroom?',
                        'translation': 'قد'
                    },
                    {
                        'word': 'Might',
                        'definition': 'Used to express possibility or uncertainty',
                        'example': 'He might come tomorrow.',
                        'translation': 'قد'
                    },
                    {
                        'word': 'Must',
                        'definition': 'Used to express obligation or necessity',
                        'example': 'I must finish my homework.',
                        'translation': 'يجب'
                    },
                    {
                        'word': 'Should',
                        'definition': 'Used to express advice or recommendation',
                        'example': 'You should study harder.',
                        'translation': 'ينبغي'
                    },
                    {
                        'word': 'Would',
                        'definition': 'Used to express a polite request or a conditional situation',
                        'example': 'Would you like some tea?',
                        'translation': 'سي'
                    },
                    {
                        'word': 'Shall',
                        'definition': 'Used to express a future action or a strong recommendation',
                        'example': 'Shall we go to the park?',
                        'translation': 'ينبغي'
                    },
                    {
                        'word': 'Ought to',
                        'definition': 'Used to express a strong recommendation or duty',
                        'example': 'You ought to visit your grandparents.',
                        'translation': 'ينبغي'
                    },
                    {
                        'word': 'Need',
                        'definition': 'Used to express necessity',
                        'example': 'You need to rest.',
                        'translation': 'تحتاج'
                    },
                ]
            },
        ]

        self.create_lessons_with_flashcards(level, lessons_data)

    def generate_advanced_lessons(self, level):
        lessons_data = [
            {
                'title': 'Advanced Idioms',
                'content': 'Learn complex English idiomatic expressions',
                'difficulty': 'advanced',
                'flashcards': [
                    {
                        'word': 'Break a leg',
                        'definition': 'Good luck, especially in theater or performance',
                        'example': 'Before the play, the director told the actors to break a leg.',
                        'translation': 'حظا موفقا'
                    },
                    {
                        'word': 'Bite the bullet',
                        'definition': 'To endure a painful or unpleasant situation that is unavoidable',
                        'example': 'When the car broke down, we had to bite the bullet and call a tow truck.',
                        'translation': 'تحمل الألم'
                    },
                    {
                        'word': 'Hit the nail on the head',
                        'definition': 'To be exactly right about something',
                        'example': 'Your analysis of the situation hit the nail on the head.',
                        'translation': 'أصاب في المطلوب'
                    },
                    {
                        'word': 'Burn the midnight oil',
                        'definition': 'To work late into the night, typically studying or working on something important',
                        'example': 'I had to burn the midnight oil to finish my project on time.',
                        'translation': 'يعمل حتى متأخرا'
                    },
                    {
                        'word': 'Let the cat out of the bag',
                        'definition': 'To reveal a secret unintentionally',
                        'example': 'She let the cat out of the bag about their surprise party.',
                        'translation': 'يكشف السر'
                    },
                    {
                        'word': 'A piece of cake',
                        'definition': 'Something that is very easy to do',
                        'example': 'The test was a piece of cake; I finished it in no time.',
                        'translation': 'أمر سهل'
                    },
                    {
                        'word': 'Costs an arm and a leg',
                        'definition': 'Something that is very expensive',
                        'example': 'The new iPhone costs an arm and a leg.',
                        'translation': 'غالي الثمن'
                    },
                    {
                        'word': 'In the same boat',
                        'definition': 'To be in the same difficult situation as someone else',
                        'example': 'We’re all in the same boat; we need to work together to solve this problem.',
                        'translation': 'في نفس المأزق'
                    },
                    {
                        'word': 'On the ball',
                        'definition': 'To be alert, attentive, and efficient',
                        'example': 'She’s really on the ball when it comes to managing projects.',
                        'translation': 'يتمتع بالانتباه والكفاءة'
                    },
                    {
                        'word': 'Pull someone’s leg',
                        'definition': 'To tease or joke with someone',
                        'example': 'Are you pulling my leg about the promotion?',
                        'translation': 'يمزح مع شخص ما'
                    },
                ]
            },
            {
                'title': 'Advanced Phrasal Verbs',
                'content': 'Learn complex phrasal verbs in English',
                'difficulty': 'advanced',
                'flashcards': [
                    {
                        'word': 'Break down',
                        'definition': 'To stop working or functioning',
                        'example': 'The car broke down on the way to the office.',
                        'translation': 'يتعطل'
                    },
                    {
                        'word': 'Bring up',
                        'definition': 'To mention a topic in a conversation',
                        'example': 'She brought up the idea of going on a vacation.',
                        'translation': 'يذكر موضوعا'
                    },
                    {
                        'word': 'Call off',
                        'definition': 'To cancel an event or arrangement',
                        'example': 'The meeting was called off due to bad weather.',
                        'translation': 'يلغي'
                    },
                    {
                        'word': 'Carry on',
                        'definition': 'To continue with an activity or process',
                        'example': 'Despite the difficulties, they decided to carry on with the project.',
                        'translation': 'يستمر'
                    },
                    {
                        'word': 'Check in',
                        'definition': 'To register at a hotel or airport',
                        'example': 'We need to check in at the hotel before 6 PM.',
                        'translation': 'يسجل الوصول'
                    },
                    {
                        'word': 'Check out',
                        'definition': 'To leave a hotel after paying the bill',
                        'example': 'We checked out of the hotel this morning.',
                        'translation': 'يسجل المغادرة'
                    },
                    {
                        'word': 'Come across',
                        'definition': 'To find or meet someone or something by chance',
                        'example': 'I came across an old friend at the mall.',
                        'translation': 'يجد شيئا أو شخصا عن طريق الصدفة'
                    },
                    {
                        'word': 'Cut down',
                        'definition': 'To reduce the size or amount of something',
                        'example': 'We need to cut down on our expenses.',
                        'translation': 'يخفض'
                    },
                    {
                        'word': 'Drop off',
                        'definition': 'To leave someone or something at a particular place',
                        'example': 'Can you drop me off at the train station?',
                        'translation': 'يضع شخصا أو شيئا في مكان معين'
                    },
                    {
                        'word': 'Fill in',
                        'definition': 'To complete a form or document',
                        'example': 'Please fill in your details on the application form.',
                        'translation': 'يملأ'
                    },
                ]
            },
            {
                'title': 'Complex Sentence Structures',
                'content': 'Learn to construct complex sentences in English',
                'difficulty': 'advanced',
                'flashcards': [
                    {
                        'word': 'Subordinate Clause',
                        'definition': 'A clause that cannot stand alone as a sentence and is dependent on a main clause',
                        'example': 'Although it was raining, we went for a walk.',
                        'translation': 'جملة فرعية'
                    },
                    {
                        'word': 'Relative Clause',
                        'definition': 'A clause that modifies a noun and is introduced by a relative pronoun',
                        'example': 'The book that I read was very interesting.',
                        'translation': 'جملة نسبية'
                    },
                    {
                        'word': 'Adverbial Clause',
                        'definition': 'A clause that functions as an adverb, modifying a verb, adjective, or adverb',
                        'example': 'She sings beautifully when she is happy.',
                        'translation': 'جملة اسمية'
                    },
                    {
                        'word': 'Conditional Clause',
                        'definition': 'A clause that expresses a condition or supposition',
                        'example': 'If it rains, we will stay indoors.',
                        'translation': 'جملة فرعية شرطية'
                    },
                    {
                        'word': 'Noun Clause',
                        'definition': 'A clause that functions as a noun, typically introduced by a wh-word',
                        'example': 'What she said surprised everyone.',
                        'translation': 'جملة اسمية'
                    },
                    {
                        'word': 'Infinitive Clause',
                        'definition': 'A clause that uses the infinitive form of a verb',
                        'example': 'To succeed, you must work hard.',
                        'translation': 'جملة فعل إلهامي'
                    },
                    {
                        'word': 'Gerund Clause',
                        'definition': 'A clause that uses a gerund (verb form ending in -ing)',
                        'example': 'Swimming is good for your health.',
                        'translation': 'جملة فعل مصدري'
                    },
                    {
                        'word': 'Participial Clause',
                        'definition': 'A clause that uses a participle (verb form ending in -ed or -ing)',
                        'example': 'Having finished his work, he went home.',
                        'translation': 'جملة فعل مبني للمجهول'
                    },
                    {
                        'word': 'Appositive Clause',
                        'definition': 'A clause that renames or explains a noun in the main clause',
                        'example': 'My friend, who is a doctor, will help you.',
                        'translation': 'جملة موضوعية'
                    },
                    {
                        'word': 'Elliptical Clause',
                        'definition': 'A clause where some words are omitted because they are understood from the context',
                        'example': 'She speaks French better than I [speak French].',
                        'translation': 'جملة مقتطعة'
                    },
                ]
            },
            {
                'title': 'Advanced Vocabulary',
                'content': 'Learn advanced vocabulary in English',
                'difficulty': 'advanced',
                'flashcards': [
                    {
                        'word': 'Ephemeral',
                        'definition': 'Lasting for a very short time',
                        'example': 'The beauty of the sunset was ephemeral.',
                        'translation': 'قصير الأمد'
                    },
                    {
                        'word': 'Perfunctory',
                        'definition': 'Carried out with a minimum of effort or reflection',
                        'example': 'He gave a perfunctory nod.',
                        'translation': 'ميال'
                    },
                    {
                        'word': 'Lugubrious',
                        'definition': 'Looking or sounding sad and dismal',
                        'example': 'His lugubrious expression made everyone feel sad.',
                        'translation': 'حزين'
                    },
                    {
                        'word': 'Obsequious',
                        'definition': 'Excessively eager to please or obey',
                        'example': 'He was obsequious to his boss.',
                        'translation': 'متملق'
                    },
                    {
                        'word': 'Pernicious',
                        'definition': 'Having a harmful effect, especially in a gradual or subtle way',
                        'example': 'Smoking has a pernicious effect on health.',
                        'translation': 'ضار'
                    },
                    {
                        'word': 'Querulous',
                        'definition': 'Complaining in a petulant or whining manner',
                        'example': 'She had a querulous tone.',
                        'translation': 'يشكو'
                    },
                    {
                        'word': 'Serendipity',
                        'definition': 'The occurrence of events by chance in a happy or beneficial way',
                        'example': 'Finding the book was a serendipity.',
                        'translation': 'حظ سعيد'
                    },
                    {
                        'word': 'Trepidation',
                        'definition': 'A feeling of fear or agitation about something that may happen',
                        'example': 'She felt trepidation before the exam.',
                        'translation': 'رعب'
                    },
                    {
                        'word': 'Ubiquitous',
                        'definition': 'Present, appearing, or found everywhere',
                        'example': 'Computers are ubiquitous in modern life.',
                        'translation': 'شائع'
                    },
                    {
                        'word': 'Vexatious',
                        'definition': 'Causing annoyance, frustration, or worry',
                        'example': 'The problem was vexatious to everyone.',
                        'translation': 'مزعج'
                    },
                ]
            },
            {
                'title': 'Advanced Grammar Rules',
                'content': 'Learn advanced grammar rules in English',
                'difficulty': 'advanced',
                'flashcards': [
                    {
                        'word': 'Subjunctive Mood',
                        'definition': 'A verb form used to express a wish, suggestion, or hypothesis',
                        'example': 'If I were rich, I would travel the world.',
                        'translation': 'فعل مضارع مجهول النواه'
                    },
                    {
                        'word': 'Parallel Structure',
                        'definition': 'Using the same pattern of words to show that two or more ideas have the same level of importance',
                        'example': 'She likes to read, to write, and to travel.',
                        'translation': 'هيكل متوازي'
                    },
                    {
                        'word': 'Split Infinitives',
                        'definition': 'Placing an adverb between "to" and the verb in an infinitive',
                        'example': 'To boldly go where no man has gone before.',
                        'translation': 'فعل إلهامي مقسوم'
                    },
                    {
                        'word': 'Dangling Modifiers',
                        'definition': 'A modifier that does not clearly modify a specific word in the sentence',
                        'example': 'Walking to the store, the sun was shining brightly.',
                        'translation': 'مُعَدِّل مُعَلَّق'
                    },
                    {
                        'word': 'Appositive Phrases',
                        'definition': 'A noun or noun phrase that renames another noun right beside it',
                        'example': 'My friend, a doctor, will help you.',
                        'translation': 'عبارة موضوعية'
                    },
                    {
                        'word': 'Ellipsis',
                        'definition': 'The omission of a word or words that are understood',
                        'example': 'She speaks French better than I [speak French].',
                        'translation': 'إسقاط'
                    },
                    {
                        'word': 'Anaphora',
                        'definition': 'The repetition of a word or phrase at the beginning of successive clauses',
                        'example': 'We shall fight on the beaches, we shall fight on the landing grounds.',
                        'translation': 'تكرار متتابع'
                    },
                    {
                        'word': 'Antithesis',
                        'definition': 'The juxtaposition of contrasting ideas in balanced phrases',
                        'example': 'Give every man thy ear, but few thy voice.',
                        'translation': 'تناقض'
                    },
                    {
                        'word': 'Zeugma',
                        'definition': 'The use of a word to modify or govern two or more words, though appropriate to only one',
                        'example': 'He took his hat and his leave.',
                        'translation': 'تثليث'
                    },
                    {
                        'word': 'Oxymoron',
                        'definition': 'A figure of speech in which two opposite ideas are joined to create an effect',
                        'example': 'Deafening silence.',
                        'translation': 'تناقض'
                    },
                ]
            },
        ]

        self.create_lessons_with_flashcards(level, lessons_data)

    def create_lessons_with_flashcards(self, level, lessons_data):
        for lesson_data in lessons_data:
            try:
                lesson = Lesson.objects.create(
                    title=lesson_data['title'],
                    content=lesson_data['content'],
                    difficulty=lesson_data['difficulty'],
                    level=level,
                    is_unlocked=True,
                    points_to_complete=50
                )
                logger.info(f"Created lesson: {lesson.title}")

                # Create Flashcards
                flashcards = []
                for idx, fc_data in enumerate(lesson_data['flashcards'], start=1):
                    try:
                        flashcard, created = Flashcard.objects.get_or_create(
                            lesson=lesson,
                            word=fc_data['word'],
                            defaults={
                                'definition': fc_data['definition'],
                                'example': fc_data.get('example', ''),
                                'translation': fc_data.get('translation', ''),
                                'question': fc_data.get('question', fc_data['definition']),
                                'order': idx,
                                'is_last_card': (idx == len(lesson_data['flashcards'])),
                                'blank_placeholder': '______'
                            }
                        )

                        # Automatically generate fill-in-blank template
                        flashcard.fill_in_blank_template = flashcard.generate_fill_in_blank()
                        flashcard.save()

                        # Update order if not created
                        if not created:
                            flashcard.order = idx
                            flashcard.is_last_card = (idx == len(lesson_data['flashcards']))
                            flashcard.save()

                        flashcards.append(flashcard)
                    except Exception as e:
                        logger.error(f"Error creating flashcard for {lesson.title}: {e}")
                        continue

                # Create Quiz
                try:
                    quiz = Quiz.objects.create(
                        lesson=lesson,
                        title=f"Quiz for {lesson.title}",
                        passing_score=80,
                        total_questions=len(flashcards)
                    )
                    self.generate_quiz_questions(quiz, flashcards)
                except Exception as e:
                    logger.error(f"Error creating quiz for {lesson.title}: {e}")
                    continue  # Skip to the next lesson

                # Create Level Test
                self.create_level_test(level, flashcards)

            except Exception as e:
                logger.error(f"Error creating lesson {lesson_data['title']}: {e}")
                continue

    def generate_quiz_questions(self, quiz, flashcards):
        """
        Generate fill-in-the-blank quiz questions
        """
        for flashcard in flashcards:
            try:
                # Generate question text with a placeholder
                question_strategies = [
                    f"Fill in the blank: {flashcard.example.replace(flashcard.word, '______')}",
                    f"What word means: {flashcard.definition}?",
                    f"Translate the word: {flashcard.translation}"
                ]

                QuizQuestion.objects.create(
                    quiz=quiz,
                    question_text=random.choice(question_strategies),
                    correct_answer=flashcard.word,
                    order=0,
                    blank_placeholder='______'
                )
            except Exception as e:
                logger.error(f"Error generating quiz question for {flashcard.word}: {e}")

    def create_level_test(self, level, flashcards):
        level_test = LevelTest.objects.create(
            level=level,
            title=f"Level Test for {level.name}",
            passing_score=80
        )

        # Generate 10 questions for the level test
        for _ in range(10):
            flashcard = random.choice(flashcards)
            LevelTestQuestion.objects.create(
                level_test=level_test,
                question_text=flashcard.example.replace(flashcard.word, '______'),
                correct_answer=flashcard.word,
                order=0,
                blank_placeholder='______'
            )

    def generate_answer_options(self, flashcard):
        options = [flashcard.word]

        # Generate wrong answers based on various strategies
        wrong_answers = [
            WordGenerator.generate_phonetic_variant(flashcard.word),
            random.choice(WordGenerator.get_synonyms(flashcard.word) or [flashcard.word + 'x']),
            ''.join(random.choices(string.ascii_lowercase, k=len(flashcard.word))),
            self.generate_definition_based_distractor(flashcard)
        ]

        # Remove duplicates and limit to 3 additional options
        wrong_answers = list(set(wrong_answers) - set(options))[:3]
        options.extend(wrong_answers)

        # Shuffle options
        random.shuffle(options)
        return options

    def generate_definition_based_distractor(self, flashcard):
        # Generate a wrong answer based on definition keywords
        definition_words = re.findall(r'\b\w+\b', flashcard.definition.lower())
        relevant_words = [w for w in definition_words if len(w) > 3]

        return relevant_words[0] if relevant_words else self.generate_random_word()

    def generate_random_word(self, length=5):
        return ''.join(random.choices(string.ascii_lowercase, k=length))
