from django.core.management.base import BaseCommand
from django.db import connection
from django.db.utils import ProgrammingError
from lessons.models import Level, Lesson, Flashcard, Quiz, QuizQuestion, LevelTest, LevelTestQuestion
from accounts.utils import ensure_schema
import random
import string

class Command(BaseCommand):
    help = 'Populate the database with initial data for lessons'

    def handle(self, *args, **kwargs):
        ensure_schema()
        self.ensure_tables_exist()
        self.stdout.write(self.style.WARNING('Clearing existing lesson data...'))
        self.clear_existing_content()
        self.stdout.write(self.style.SUCCESS('Existing lesson data cleared.'))

        self.stdout.write(self.style.WARNING('Creating new lesson data...'))
        self.create_levels()
        self.create_lessons()
        self.create_level_tests()
        self.stdout.write(self.style.SUCCESS('New lesson data created successfully.'))

    def ensure_tables_exist(self):
        tables = [
            'lessons_level',
            'lessons_lesson',
            'lessons_flashcard',
            'lessons_quiz',
            'lessons_quizquestion',
            'lessons_leveltest',
            'lessons_leveltestquestion',
            'lessons_leveltest_questions'
        ]
        with connection.cursor() as cursor:
            for table in tables:
                try:
                    cursor.execute(f"SELECT 1 FROM {table} LIMIT 1;")
                except ProgrammingError:
                    self.stdout.write(self.style.WARNING(f"Table {table} does not exist. Creating..."))
                    if table in ['lessons_leveltestquestion', 'lessons_leveltest_questions']:
                        cursor.execute(f"""
                            CREATE TABLE {table} (
                                id SERIAL PRIMARY KEY,
                                level_test_id INTEGER REFERENCES lessons_leveltest(id),
                                question TEXT,
                                options TEXT[],
                                correct_answer INTEGER
                            );
                        """)
                    else:
                        cursor.execute(f"CREATE TABLE {table} (id SERIAL PRIMARY KEY);")
                    self.stdout.write(self.style.SUCCESS(f"Table {table} created."))

    def clear_existing_content(self):
        with connection.cursor() as cursor:
            cursor.execute("""
                TRUNCATE TABLE lessons_leveltestquestion, lessons_leveltest_questions, 
                lessons_leveltest, lessons_quizquestion, lessons_quiz, lessons_flashcard, 
                lessons_lesson, lessons_level RESTART IDENTITY CASCADE;
            """)

    def create_levels(self):
        levels = [
            {'name': 'Beginner', 'level_order': 1},
            {'name': 'Intermediate', 'level_order': 2},
            {'name': 'Advanced', 'level_order': 3},
        ]
        for level_data in levels:
            Level.objects.create(**level_data)
        self.stdout.write(self.style.SUCCESS('Successfully created levels'))

    def create_lessons(self):
        levels = Level.objects.all()
        for level in levels:
            if level.name == 'Beginner':
                self.create_beginner_lessons(level)
            elif level.name == 'Intermediate':
                self.create_intermediate_lessons(level)
            elif level.name == 'Advanced':
                self.create_advanced_lessons(level)

    def create_lessons_and_flashcards(self, level, lessons_data):
        for lesson_data in lessons_data:
            lesson = Lesson.objects.create(
                level=level,
                title=lesson_data['title'],
                content=lesson_data['content'],
                difficulty=lesson_data.get('difficulty', 'beginner')
            )
            self.stdout.write(f'Created lesson: {lesson.title}')

            for flashcard_data in lesson_data['flashcards']:
                flashcard = Flashcard.objects.create(
                    lesson=lesson,
                    word=flashcard_data['word'],
                    meaning=flashcard_data['meaning'],
                    question=flashcard_data['question']
                )
                self.stdout.write(f'Created flashcard: {flashcard.word}')

            self.create_lesson_quiz(lesson)

    def create_beginner_lessons(self, level):
        lessons = [
            {
                'title': 'Alphabet Mastery',
                'content': 'Learn the English alphabet and practice letter recognition.',
                'difficulty': 'beginner',
                'flashcards': self.generate_alphabet_flashcards()
            },
            {
                'title': 'Basic Greetings',
                'content': 'Learn common English greetings and introductions.',
                'flashcards': [
                    {'word': 'Hello', 'meaning': 'A common greeting', 'question': 'What do you say to greet someone?'},
                    {'word': 'Goodbye', 'meaning': 'A farewell expression', 'question': 'What do you say when leaving?'},
                    {'word': 'Please', 'meaning': 'Used for polite requests', 'question': 'What word do you use to make a polite request?'},
                    {'word': 'Thank you', 'meaning': 'An expression of gratitude', 'question': 'What do you say to express gratitude?'},
                    {'word': 'Sorry', 'meaning': 'Used to apologize', 'question': 'What word do you use to apologize?'},
                ]
            },
            {
                'title': 'Basic Numbers',
                'content': 'Learn to count from 1 to 10 in English.',
                'flashcards': [
                    {'word': 'One', 'meaning': 'The number 1', 'question': 'What is the word for the number 1?'},
                    {'word': 'Two', 'meaning': 'The number 2', 'question': 'What is the word for the number 2?'},
                    {'word': 'Three', 'meaning': 'The number 3', 'question': 'What is the word for the number 3?'},
                    {'word': 'Four', 'meaning': 'The number 4', 'question': 'What is the word for the number 4?'},
                    {'word': 'Five', 'meaning': 'The number 5', 'question': 'What is the word for the number 5?'},
                ]
            },
            {
                'title': 'Basic Colors',
                'content': 'Learn the names of basic colors in English.',
                'flashcards': [
                    {'word': 'Red', 'meaning': 'A primary color', 'question': 'What is the word for the color of a tomato?'},
                    {'word': 'Blue', 'meaning': 'A primary color', 'question': 'What is the word for the color of the sky?'},
                    {'word': 'Green', 'meaning': 'A secondary color', 'question': 'What is the word for the color of grass?'},
                    {'word': 'Yellow', 'meaning': 'A primary color', 'question': 'What is the word for the color of a banana?'},
                    {'word': 'Black', 'meaning': 'A color', 'question': 'What is the word for the color of a night sky?'},
                ]
            },
            {
                'title': 'Basic Animals',
                'content': 'Learn the names of common animals in English.',
                'flashcards': [
                    {'word': 'Dog', 'meaning': 'A common pet', 'question': 'What is the word for a furry pet that barks?'},
                    {'word': 'Cat', 'meaning': 'A common pet', 'question': 'What is the word for a furry pet that meows?'},
                    {'word': 'Bird', 'meaning': 'An animal that flies', 'question': 'What is the word for an animal with wings that can fly?'},
                    {'word': 'Fish', 'meaning': 'An animal that swims', 'question': 'What is the word for an animal that lives in water and has fins?'},
                    {'word': 'Cow', 'meaning': 'An animal that gives milk', 'question': 'What is the word for a large animal that gives milk and is often found on farms?'},
                ]
            },
            {
                'title': 'Basic Food',
                'content': 'Learn the names of common foods in English.',
                'flashcards': [
                    {'word': 'Apple', 'meaning': 'A fruit', 'question': 'What is the word for a round fruit that is often red or green?'},
                    {'word': 'Bread', 'meaning': 'A staple food', 'question': 'What is the word for a food made from flour, water, and yeast?'},
                    {'word': 'Egg', 'meaning': 'A food item', 'question': 'What is the word for a round object that comes from a chicken and is often eaten for breakfast?'},
                    {'word': 'Milk', 'meaning': 'A drink', 'question': 'What is the word for a white liquid that comes from cows and is often drunk by humans?'},
                    {'word': 'Cheese', 'meaning': 'A dairy product', 'question': 'What is the word for a food made from milk that is often yellow or white and comes in different flavors?'},
                ]
            },
            {
                'title': 'Basic Family',
                'content': 'Learn the names of family members in English.',
                'flashcards': [
                    {'word': 'Mother', 'meaning': 'A parent', 'question': 'What is the word for a female parent?'},
                    {'word': 'Father', 'meaning': 'A parent', 'question': 'What is the word for a male parent?'},
                    {'word': 'Sister', 'meaning': 'A sibling', 'question': 'What is the word for a female sibling?'},
                    {'word': 'Brother', 'meaning': 'A sibling', 'question': 'What is the word for a male sibling?'},
                    {'word': 'Grandmother', 'meaning': 'A grandparent', 'question': 'What is the word for a female grandparent?'},
                ]
            },
            {
                'title': 'Basic Days of the Week',
                'content': 'Learn the names of the days of the week in English.',
                'flashcards': [
                    {'word': 'Monday', 'meaning': 'The first day of the week', 'question': 'What is the word for the first day of the week?'},
                    {'word': 'Tuesday', 'meaning': 'The second day of the week', 'question': 'What is the word for the second day of the week?'},
                    {'word': 'Wednesday', 'meaning': 'The third day of the week', 'question': 'What is the word for the third day of the week?'},
                    {'word': 'Thursday', 'meaning': 'The fourth day of the week', 'question': 'What is the word for the fourth day of the week?'},
                    {'word': 'Friday', 'meaning': 'The fifth day of the week', 'question': 'What is the word for the fifth day of the week?'},
                ]
            },
            {
                'title': 'Basic Months of the Year',
                'content': 'Learn the names of the months of the year in English.',
                'flashcards': [
                    {'word': 'January', 'meaning': 'The first month of the year', 'question': 'What is the word for the first month of the year?'},
                    {'word': 'February', 'meaning': 'The second month of the year', 'question': 'What is the word for the second month of the year?'},
                    {'word': 'March', 'meaning': 'The third month of the year', 'question': 'What is the word for the third month of the year?'},
                    {'word': 'April', 'meaning': 'The fourth month of the year', 'question': 'What is the word for the fourth month of the year?'},
                    {'word': 'May', 'meaning': 'The fifth month of the year', 'question': 'What is the word for the fifth month of the year?'},
                ]
            },
            {
                'title': 'Basic Weather',
                'content': 'Learn the names of common weather conditions in English.',
                'flashcards': [
                    {'word': 'Sunny', 'meaning': 'Bright and clear weather', 'question': 'What is the word for bright and clear weather?'},
                    {'word': 'Rainy', 'meaning': 'Weather with rain', 'question': 'What is the word for weather with rain?'},
                    {'word': 'Cloudy', 'meaning': 'Weather with clouds', 'question': 'What is the word for weather with clouds?'},
                    {'word': 'Windy', 'meaning': 'Weather with wind', 'question': 'What is the word for weather with wind?'},
                    {'word': 'Snowy', 'meaning': 'Weather with snow', 'question': 'What is the word for weather with snow?'},
                ]
            },
            {
                'title': 'Basic Shapes',
                'content': 'Learn the names of basic shapes in English.',
                'flashcards': [
                    {'word': 'Circle', 'meaning': 'A round shape', 'question': 'What is the word for a round shape?'},
                    {'word': 'Square', 'meaning': 'A shape with four equal sides', 'question': 'What is the word for a shape with four equal sides?'},
                    {'word': 'Triangle', 'meaning': 'A shape with three sides', 'question': 'What is the word for a shape with three sides?'},
                    {'word': 'Rectangle', 'meaning': 'A shape with four sides, two of which are longer than the other two', 'question': 'What is the word for a shape with four sides, two of which are longer than the other two?'},
                    {'word': 'Star', 'meaning': 'A shape with points', 'question': 'What is the word for a shape with points?'},
                ]
            },
        ]
        self.create_lessons_and_flashcards(level, lessons)

    def create_intermediate_lessons(self, level):
        lessons = [
            {
                'title': 'Common Phrases',
                'content': 'Learn and practice common English phrases.',
                'flashcards': [
                    {'word': 'Nice to meet you', 'meaning': 'A polite greeting when meeting someone for the first time', 'question': 'What do you say when meeting someone new?'},
                    {'word': 'How are you?', 'meaning': 'A common way to ask about someone\'s well-being', 'question': 'What question do you ask to inquire about someone\'s state?'},
                    {'word': 'What\'s up?', 'meaning': 'An informal way to greet someone or ask what\'s happening', 'question': 'What\'s an informal way to ask "What\'s happening?"'},
                    {'word': 'Take care', 'meaning': 'A friendly way to say goodbye', 'question': 'What\'s a friendly way to say goodbye?'},
                    {'word': 'See you later', 'meaning': 'A casual way to say goodbye, implying you\'ll meet again', 'question': 'What do you say when you expect to see someone again soon?'},
                ]
            },
            {
                'title': 'Present Continuous Tense',
                'content': 'Learn to use the present continuous tense in English.',
                'flashcards': [
                    {'word': 'I am reading', 'meaning': 'Present continuous tense', 'question': 'What is the present continuous form of "I read"?'},
                    {'word': 'You are writing', 'meaning': 'Present continuous tense', 'question': 'What is the present continuous form of "You write"?'},
                    {'word': 'He is singing', 'meaning': 'Present continuous tense', 'question': 'What is the present continuous form of "He sings"?'},
                    {'word': 'She is dancing', 'meaning': 'Present continuous tense', 'question': 'What is the present continuous form of "She dances"?'},
                    {'word': 'We are playing', 'meaning': 'Present continuous tense', 'question': 'What is the present continuous form of "We play"?'},
                ]
            },
            {
                'title': 'Past Simple Tense',
                'content': 'Learn to use the past simple tense in English.',
                'flashcards': [
                    {'word': 'I walked', 'meaning': 'Past simple tense', 'question': 'What is the past simple form of "I walk"?'},
                    {'word': 'You wrote', 'meaning': 'Past simple tense', 'question': 'What is the past simple form of "You write"?'},
                    {'word': 'He sang', 'meaning': 'Past simple tense', 'question': 'What is the past simple form of "He sings"?'},
                    {'word': 'She danced', 'meaning': 'Past simple tense', 'question': 'What is the past simple form of "She dances"?'},
                    {'word': 'We played', 'meaning': 'Past simple tense', 'question': 'What is the past simple form of "We play"?'},
                ]
            },
            {
                'title': 'Future Simple Tense',
                'content': 'Learn to use the future simple tense in English.',
                'flashcards': [
                    {'word': 'I will walk', 'meaning': 'Future simple tense', 'question': 'What is the future simple form of "I walk"?'},
                    {'word': 'You will write', 'meaning': 'Future simple tense', 'question': 'What is the future simple form of "You write"?'},
                    {'word': 'He will sing', 'meaning': 'Future simple tense', 'question': 'What is the future simple form of "He sings"?'},
                    {'word': 'She will dance', 'meaning': 'Future simple tense', 'question': 'What is the future simple form of "She dances"?'},
                    {'word': 'We will play', 'meaning': 'Future simple tense', 'question': 'What is the future simple form of "We play"?'},
                ]
            },
            {
                'title': 'Modal Verbs',
                'content': 'Learn to use modal verbs in English.',
                'flashcards': [
                    {'word': 'Can', 'meaning': 'Ability or permission', 'question': 'What modal verb is used to express ability or permission?'},
                    {'word': 'Must', 'meaning': 'Necessity', 'question': 'What modal verb is used to express necessity?'},
                    {'word': 'Should', 'meaning': 'Advice', 'question': 'What modal verb is used to give advice?'},
                    {'word': 'Might', 'meaning': 'Possibility', 'question': 'What modal verb is used to express possibility?'},
                    {'word': 'Would', 'meaning': 'Conditional', 'question': 'What modal verb is used to express a conditional situation?'},
                ]
            },
            {
                'title': 'Prepositions of Time',
                'content': 'Learn to use prepositions of time in English.',
                'flashcards': [
                    {'word': 'At', 'meaning': 'Used for specific times', 'question': 'What preposition is used for specific times like "at 5 o\'clock"?'},
                    {'word': 'In', 'meaning': 'Used for longer periods', 'question': 'What preposition is used for longer periods like "in the morning"?'},
                    {'word': 'On', 'meaning': 'Used for days and dates', 'question': 'What preposition is used for days and dates like "on Monday"?'},
                    {'word': 'During', 'meaning': 'Used for events', 'question': 'What preposition is used for events like "during the meeting"?'},
                    {'word': 'For', 'meaning': 'Used for durations', 'question': 'What preposition is used for durations like "for two hours"?'},
                ]
            },
            {
                'title': 'Prepositions of Place',
                'content': 'Learn to use prepositions of place in English.',
                'flashcards': [
                    {'word': 'In', 'meaning': 'Used for inside locations', 'question': 'What preposition is used for inside locations like "in the house"?'},
                    {'word': 'On', 'meaning': 'Used for surfaces', 'question': 'What preposition is used for surfaces like "on the table"?'},
                    {'word': 'Under', 'meaning': 'Used for below locations', 'question': 'What preposition is used for below locations like "under the bed"?'},
                    {'word': 'Next to', 'meaning': 'Used for adjacent locations', 'question': 'What preposition is used for adjacent locations like "next to the park"?'},
                    {'word': 'Between', 'meaning': 'Used for middle locations', 'question': 'What preposition is used for middle locations like "between the trees"?'},
                ]
            },
            {
                'title': 'Adjectives',
                'content': 'Learn to use adjectives in English.',
                'flashcards': [
                    {'word': 'Big', 'meaning': 'Large in size', 'question': 'What adjective means large in size?'},
                    {'word': 'Small', 'meaning': 'Little in size', 'question': 'What adjective means little in size?'},
                    {'word': 'Happy', 'meaning': 'Feeling pleasure', 'question': 'What adjective means feeling pleasure?'},
                    {'word': 'Sad', 'meaning': 'Feeling sorrow', 'question': 'What adjective means feeling sorrow?'},
                    {'word': 'Fast', 'meaning': 'Quick in movement', 'question': 'What adjective means quick in movement?'},
                ]
            },
            {
                'title': 'Adverbs',
                'content': 'Learn to use adverbs in English.',
                'flashcards': [
                    {'word': 'Quickly', 'meaning': 'Fast in action', 'question': 'What adverb means fast in action?'},
                    {'word': 'Slowly', 'meaning': 'Not fast in action', 'question': 'What adverb means not fast in action?'},
                    {'word': 'Well', 'meaning': 'In a good way', 'question': 'What adverb means in a good way?'},
                    {'word': 'Badly', 'meaning': 'In a bad way', 'question': 'What adverb means in a bad way?'},
                    {'word': 'Hard', 'meaning': 'With effort', 'question': 'What adverb means with effort?'},
                ]
            },
            {
                'title': 'Comparative and Superlative',
                'content': 'Learn to use comparative and superlative forms in English.',
                'flashcards': [
                    {'word': 'Bigger', 'meaning': 'Comparative form of big', 'question': 'What is the comparative form of "big"?'},
                    {'word': 'Biggest', 'meaning': 'Superlative form of big', 'question': 'What is the superlative form of "big"?'},
                    {'word': 'Sadder', 'meaning': 'Comparative form of sad', 'question': 'What is the comparative form of "sad"?'},
                    {'word': 'Saddest', 'meaning': 'Superlative form of sad', 'question': 'What is the superlative form of "sad"?'},
                    {'word': 'Faster', 'meaning': 'Comparative form of fast', 'question': 'What is the comparative form of "fast"?'},
                ]
            },
        ]
        self.create_lessons_and_flashcards(level, lessons)

    def create_advanced_lessons(self, level):
        lessons = [
            {
                'title': 'Idiomatic Expressions',
                'content': 'Learn and practice common English idiomatic expressions.',
                'flashcards': [
                    {'word': 'Break a leg', 'meaning': 'Good luck (often used in theater)', 'question': 'What idiomatic expression means "good luck" in theater?'},
                    {'word': 'Hit the books', 'meaning': 'To study hard', 'question': 'What idiom means to study intensively?'},
                    {'word': 'Piece of cake', 'meaning': 'Something very easy to do', 'question': 'What expression describes a task that\'s very easy?'},
                    {'word': 'Cost an arm and a leg', 'meaning': 'To be very expensive', 'question': 'What idiom means something is extremely costly?'},
                    {'word': 'Under the weather', 'meaning': 'Feeling ill', 'question': 'What expression means feeling slightly unwell?'},
                ]
            },
            {
                'title': 'Complex Sentence Structures',
                'content': 'Learn to construct complex sentences in English.',
                'flashcards': [
                    {'word': 'Although', 'meaning': 'Despite', 'question': 'What conjunction is used to show contrast?'},
                    {'word': 'Since', 'meaning': 'Because', 'question': 'What conjunction is used to show reason?'},
                    {'word': 'While', 'meaning': 'During the time that', 'question': 'What conjunction is used to show time?'},
                    {'word': 'If', 'meaning': 'In the condition that', 'question': 'What conjunction is used to show condition?'},
                    {'word': 'Unless', 'meaning': 'Except if', 'question': 'What conjunction is used to show exception?'},
                ]
            },
            {
                'title': 'Advanced Vocabulary',
                'content': 'Learn advanced vocabulary words in English.',
                'flashcards': [
                    {'word': 'Ephemeral', 'meaning': 'Lasting for a very short time', 'question': 'What word means lasting for a very short time?'},
                    {'word': 'Perpetual', 'meaning': 'Never ending or changing', 'question': 'What word means never ending or changing?'},
                    {'word': 'Eloquent', 'meaning': 'Fluent or persuasive in speaking or writing', 'question': 'What word means fluent or persuasive in speaking or writing?'},
                    {'word': 'Ambiguous', 'meaning': 'Open to more than one interpretation', 'question': 'What word means open to more than one interpretation?'},
                    {'word': 'Cognizant', 'meaning': 'Having knowledge or being aware', 'question': 'What word means having knowledge or being aware?'},
                ]
            },
            {
                'title': 'Advanced Grammar',
                'content': 'Learn advanced grammar rules in English.',
                'flashcards': [
                    {'word': 'Subjunctive Mood', 'meaning': 'Expresses hypothetical or contrary-to-fact situations', 'question': 'What grammatical mood expresses hypothetical or contrary-to-fact situations?'},
                    {'word': 'Participle', 'meaning': 'A form of a verb that is used in a sentence to modify a noun', 'question': 'What form of a verb is used to modify a noun in a sentence?'},
                    {'word': 'Gerund', 'meaning': 'A verb form that functions as a noun', 'question': 'What verb form functions as a noun?'},
                    {'word': 'Infinitive', 'meaning': 'The base form of a verb, usually preceded by "to"', 'question': 'What is the base form of a verb, usually preceded by "to"?'},
                    {'word': 'Relative Clause', 'meaning': 'A clause that modifies a noun and begins with a relative pronoun', 'question': 'What clause modifies a noun and begins with a relative pronoun?'},
                ]
            },
            {
                'title': 'Advanced Conversation',
                'content': 'Learn advanced conversation skills in English.',
                'flashcards': [
                    {'word': 'Debate', 'meaning': 'A discussion in which opposing arguments are put forward', 'question': 'What is a discussion in which opposing arguments are put forward called?'},
                    {'word': 'Persuade', 'meaning': 'To convince someone to do something', 'question': 'What verb means to convince someone to do something?'},
                    {'word': 'Negotiate', 'meaning': 'To discuss in order to reach an agreement', 'question': 'What verb means to discuss in order to reach an agreement?'},
                    {'word': 'Concede', 'meaning': 'To admit, often reluctantly, that something is true after denying it', 'question': 'What verb means to admit, often reluctantly, that something is true after denying it?'},
                    {'word': 'Compromise', 'meaning': 'A settlement of differences by mutual concessions', 'question': 'What noun means a settlement of differences by mutual concessions?'},
                ]
            },
            {
                'title': 'Advanced Writing',
                'content': 'Learn advanced writing techniques in English.',
                'flashcards': [
                    {'word': 'Alliteration', 'meaning': 'The repetition of initial sounds in a series of words', 'question': 'What is the repetition of initial sounds in a series of words called?'},
                    {'word': 'Metaphor', 'meaning': 'A figure of speech in which a term or phrase is applied to something to which it is not literally applicable', 'question': 'What figure of speech applies a term or phrase to something to which it is not literally applicable?'},
                    {'word': 'Simile', 'meaning': 'A figure of speech involving the comparison of one thing with another thing of a different kind, used to make a description more emphatic or vivid', 'question': 'What figure of speech involves the comparison of one thing with another thing of a different kind?'},
                    {'word': 'Onomatopoeia', 'meaning': 'The formation of a word from a sound associated with what is named', 'question': 'What is the formation of a word from a sound associated with what is named called?'},
                    {'word': 'Hyperbole', 'meaning': 'Exaggerated statements or claims not meant to be taken literally', 'question': 'What is the exaggerated statements or claims not meant to be taken literally called?'},
                ]
            },
            {
                'title': 'Advanced Reading',
                'content': 'Learn advanced reading comprehension skills in English.',
                'flashcards': [
                    {'word': 'Inference', 'meaning': 'A conclusion reached on the basis of evidence and reasoning', 'question': 'What is a conclusion reached on the basis of evidence and reasoning called?'},
                    {'word': 'Context', 'meaning': 'The circumstances that form the setting for an event, statement, or idea, and in terms of which it can be fully understood', 'question': 'What are the circumstances that form the setting for an event, statement, or idea called?'},
                    {'word': 'Synonym', 'meaning': 'A word or phrase that means exactly or nearly the same as another word or phrase in the same language', 'question': 'What is a word or phrase that means exactly or nearly the same as another word or phrase in the same language called?'},
                    {'word': 'Antonym', 'meaning': 'A word opposite in meaning to another', 'question': 'What is a word opposite in meaning to another called?'},
                    {'word': 'Homophone', 'meaning': 'A word that is pronounced the same as another word but differs in meaning, and may differ in spelling', 'question': 'What is a word that is pronounced the same as another word but differs in meaning called?'},
                ]
            },
            {
                'title': 'Advanced Listening',
                'content': 'Learn advanced listening comprehension skills in English.',
                'flashcards': [
                    {'word': 'Comprehension', 'meaning': 'The ability to understand something', 'question': 'What is the ability to understand something called?'},
                    {'word': 'Inference', 'meaning': 'A conclusion reached on the basis of evidence and reasoning', 'question': 'What is a conclusion reached on the basis of evidence and reasoning called?'},
                    {'word': 'Context', 'meaning': 'The circumstances that form the setting for an event, statement, or idea, and in terms of which it can be fully understood', 'question': 'What are the circumstances that form the setting for an event, statement, or idea called?'},
                    {'word': 'Pronunciation', 'meaning': 'The way in which a word or a language is customarily spoken', 'question': 'What is the way in which a word or a language is customarily spoken called?'},
                    {'word': 'Intonation', 'meaning': 'The rise and fall of the voice in speech', 'question': 'What is the rise and fall of the voice in speech called?'},
                ]
            },
            {
                'title': 'Advanced Speaking',
                'content': 'Learn advanced speaking skills in English.',
                'flashcards': [
                    {'word': 'Articulation', 'meaning': 'The clear and effective speaking of words', 'question': 'What is the clear and effective speaking of words called?'},
                    {'word': 'Fluency', 'meaning': 'The ability to speak or write easily and readily', 'question': 'What is the ability to speak or write easily and readily called?'},
                    {'word': 'Pronunciation', 'meaning': 'The way in which a word or a language is customarily spoken', 'question': 'What is the way in which a word or a language is customarily spoken called?'},
                    {'word': 'Intonation', 'meaning': 'The rise and fall of the voice in speech', 'question': 'What is the rise and fall of the voice in speech called?'},
                    {'word': 'Accent', 'meaning': 'A distinctive way of pronouncing a language, especially one associated with a particular country, area, or social class', 'question': 'What is a distinctive way of pronouncing a language called?'},
                ]
            },
            {
                'title': 'Advanced Culture',
                'content': 'Learn about advanced cultural aspects in English-speaking countries.',
                'flashcards': [
                    {'word': 'Tradition', 'meaning': 'The transmission of customs or beliefs from generation to generation', 'question': 'What is the transmission of customs or beliefs from generation to generation called?'},
                    {'word': 'Custom', 'meaning': 'A traditional and widely accepted way of behaving or doing something', 'question': 'What is a traditional and widely accepted way of behaving or doing something called?'},
                    {'word': 'Etiquette', 'meaning': 'The customary code of polite behavior in society or among members of a particular profession', 'question': 'What is the customary code of polite behavior in society called?'},
                    {'word': 'Ceremony', 'meaning': 'A formal religious or public occasion, especially one celebrating a particular event or anniversary', 'question': 'What is a formal religious or public occasion called?'},
                    {'word': 'Ritual', 'meaning': 'A religious or solemn ceremony consisting of a series of actions performed according to a prescribed order', 'question': 'What is a religious or solemn ceremony consisting of a series of actions performed according to a prescribed order called?'},
                ]
            },
        ]
        self.create_lessons_and_flashcards(level, lessons)

    def create_lessons_and_flashcards(self, level, lessons_data):
        for lesson_data in lessons_data:
            lesson = Lesson.objects.create(
                level=level,
                title=lesson_data['title'],
                content=lesson_data['content'],
                difficulty=lesson_data.get('difficulty', 'beginner')
            )
            self.stdout.write(f'Created lesson: {lesson.title}')

            for flashcard_data in lesson_data['flashcards']:
                flashcard = Flashcard.objects.create(
                    lesson=lesson,
                    word=flashcard_data['word'],
                    meaning=flashcard_data['meaning'],
                    question=flashcard_data['question']
                )
                self.stdout.write(f'Created flashcard: {flashcard.word}')

            self.create_lesson_quiz(lesson)

    def create_lesson_quiz(self, lesson):
        quiz = Quiz.objects.create(lesson=lesson, title=f"Quiz for {lesson.title}")
        flashcards = Flashcard.objects.filter(lesson=lesson)

        for flashcard in flashcards:
            QuizQuestion.objects.create(
                quiz=quiz,
                question=flashcard.question,
                correct_answer=flashcard.word
            )
        self.stdout.write(f'Created quiz for lesson: {lesson.title}')

    def create_level_tests(self):
        levels = Level.objects.all()
        for level in levels:
            level_test = LevelTest.objects.create(level=level)
            self.stdout.write(f'Created level test for level: {level.name}')

            flashcards = Flashcard.objects.filter(lesson__level=level)
            for i in range(10):
                if flashcards:
                    flashcard = random.choice(flashcards)
                    question = LevelTestQuestion.objects.create(
                        level_test=level_test,
                        question=flashcard.question,
                        correct_answer=flashcard.word
                    )
                    self.stdout.write(f'Created question: {question.question}')

    def generate_alphabet_flashcards(self):
        alphabet = string.ascii_uppercase
        flashcards = []
        for letter in alphabet:
            word = self.get_word_starting_with(letter)
            flashcards.append({
                'word': f"{letter}",
                'meaning': f"{letter} as in {word}",
                'question': f"What word starts with the letter {letter}?"
            })
        return flashcards

    def get_word_starting_with(self, letter):
        words = {
            'A': 'Apple', 'B': 'Banana', 'C': 'Cat', 'D': 'Dog', 'E': 'Elephant',
            'F': 'Fish', 'G': 'Giraffe', 'H': 'Hat', 'I': 'Ice cream', 'J': 'Jacket',
            'K': 'Kite', 'L': 'Lion', 'M': 'Moon', 'N': 'Nest', 'O': 'Orange',
            'P': 'Penguin', 'Q': 'Queen', 'R': 'Rainbow', 'S': 'Sun', 'T': 'Tree',
            'U': 'Umbrella', 'V': 'Violin', 'W': 'Water', 'X': 'X-ray', 'Y': 'Yellow',
            'Z': 'Zebra'
        }
        return words.get(letter.upper(), f"{letter}...")

    def generate_wrong_answer(self, correct_answer):
        # This is a simple implementation. You might want to improve this to generate more realistic wrong answers.
        return ''.join(random.choices(string.ascii_lowercase, k=len(correct_answer)))

    def generate_sophisticated_wrong_answer(self, correct_answer, level):
        # More advanced method for generating wrong answers
        if level.name == 'Beginner':
            # For beginners, generate wrong answers that are close in spelling
            return ''.join(random.choices(string.ascii_lowercase, k=len(correct_answer)))
        elif level.name == 'Intermediate':
            # For intermediates, generate wrong answers that are similar in meaning
            similar_words = self.get_similar_words(correct_answer)
            return random.choice(similar_words) if similar_words else ''.join(random.choices(string.ascii_lowercase, k=len(correct_answer)))
        elif level.name == 'Advanced':
            # For advanced, generate wrong answers that are plausible but incorrect
            plausible_words = self.get_plausible_words(correct_answer)
            return random.choice(plausible_words) if plausible_words else ''.join(random.choices(string.ascii_lowercase, k=len(correct_answer)))

    def get_similar_words(self, word):
        # Placeholder for a function that returns words with similar meanings
        similar_words = {
            'happy': ['joyful', 'content', 'elated'],
            'sad': ['unhappy', 'gloomy', 'depressed'],
            'big': ['large', 'huge', 'enormous'],
            'small': ['tiny', 'little', 'miniature'],
            'fast': ['quick', 'rapid', 'speedy'],
        }
        return similar_words.get(word.lower(), [])

    def get_plausible_words(self, word):
        # Placeholder for a function that returns plausible but incorrect words
        plausible_words = {
            'break a leg': ['good luck', 'best wishes', 'all the best'],
            'hit the books': ['study hard', 'work diligently', 'focus on learning'],
            'piece of cake': ['easy task', 'simple job', 'no problem'],
            'cost an arm and a leg': ['very expensive', 'high priced', 'pricey'],
            'under the weather': ['feeling ill', 'not well', 'sick'],
        }
        return plausible_words.get(word.lower(), [])
