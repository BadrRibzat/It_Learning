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
        ]
        with connection.cursor() as cursor:
            for table in tables:
                try:
                    cursor.execute(f"SELECT 1 FROM {table} LIMIT 1;")
                except ProgrammingError:
                    self.stdout.write(self.style.WARNING(f"Table {table} does not exist. Creating..."))
                    cursor.execute(f"CREATE TABLE {table} (id SERIAL PRIMARY KEY);")
                    self.stdout.write(self.style.SUCCESS(f"Table {table} created."))

    def clear_existing_content(self):
        with connection.cursor() as cursor:
            cursor.execute("""
                TRUNCATE TABLE lessons_leveltestquestion, lessons_leveltest, 
                lessons_quizquestion, lessons_quiz, lessons_flashcard, 
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
                difficulty=lesson_data.get('difficulty', 'beginner'),
                level_order=lesson_data.get('level_order', 1)
            )
            self.stdout.write(f'Created lesson: {lesson.title}')

            for flashcard_data in lesson_data['flashcards']:
                flashcard = Flashcard.objects.create(
                    lesson=lesson,
                    word=flashcard_data['word'],
                    definition=flashcard_data['meaning'],
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
        ]
        self.create_lessons_and_flashcards(level, lessons)

    def create_lesson_quiz(self, lesson):
        quiz = Quiz.objects.create(lesson=lesson, title=f"Quiz for {lesson.title}")
        flashcards = Flashcard.objects.filter(lesson=lesson)

        for flashcard in flashcards:
            QuizQuestion.objects.create(
                quiz=quiz,
                question_text=flashcard.question,
                correct_answer=flashcard.word,
                options=self.generate_quiz_options(flashcard.word)
            )
        self.stdout.write(f'Created quiz for lesson: {lesson.title}')

    def create_level_tests(self):
        levels = Level.objects.all()
        for level in levels:
            level_test = LevelTest.objects.create(level=level, title=f"Level Test for {level.name}")
        self.stdout.write(f'Created level test for level: {level.name}')

        flashcards = Flashcard.objects.filter(lesson__level=level)
        for i in range(10):
            if flashcards:
                flashcard = random.choice(flashcards)
                question = LevelTestQuestion.objects.create(
                    level_test=level_test,
                    question_text=flashcard.question,
                    correct_answer=flashcard.word,
                    options=self.generate_quiz_options(flashcard.word)
                )
                self.stdout.write(f'Created question: {question.question_text}')

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

    def generate_quiz_options(self, correct_answer):
        options = [correct_answer]
        while len(options) < 4:
            fake_option = self.generate_fake_option(correct_answer)
            if fake_option not in options:
                options.append(fake_option)
        random.shuffle(options)
        return options

    def generate_fake_option(self, correct_answer):
        # This is a simple implementation. We should improve this to generate more realistic wrong answers.
        return ''.join(random.choices(string.ascii_lowercase, k=len(correct_answer)))
