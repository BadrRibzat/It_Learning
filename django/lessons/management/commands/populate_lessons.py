from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.utils import IntegrityError
from lessons.models import Level, Lesson, Flashcard, Quiz, QuizQuestion, LevelTest, LevelTestQuestion
import random
import spacy
from transformers import pipeline, logging
import time
import warnings

# Suppress warnings
warnings.filterwarnings("ignore", category=FutureWarning)

class Command(BaseCommand):
    help = 'Populate database with generated English learning content'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Load NLP models
        self.nlp = spacy.load('en_core_web_sm')
        self.generator = pipeline('text-generation', model='gpt2')
        
    def handle(self, *args, **options):
        try:
            with transaction.atomic():
                # Clear existing data
                self.clear_existing_data()
                
                # Create levels
                levels = self.create_levels()
                
                # Generate lessons and flashcards
                for level in levels:
                    self.stdout.write(f"Generating lessons for level: {level.name}")
                    lessons = self.generate_lessons(level)
                    for lesson in lessons:
                        self.stdout.write(f"Generating flashcards for lesson: {lesson.title}")
                        flashcards = self.generate_flashcards(lesson)
                        self.stdout.write(f"Generating quiz for lesson: {lesson.title}")
                        quiz = self.generate_quiz(lesson, flashcards)
                
                # Generate level tests
                self.stdout.write("Generating level tests")
                self.generate_level_tests(levels)
                
                self.stdout.write(self.style.SUCCESS('Successfully populated database'))
        
        except KeyboardInterrupt:
            self.stdout.write(self.style.WARNING('Script interrupted by user'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error populating database: {str(e)}'))
    
    def clear_existing_data(self):
        """Clear existing data from all related models"""
        models_to_clear = [
            LevelTestQuestion, LevelTest, 
            QuizQuestion, Quiz, 
            Flashcard, Lesson, 
            Level
        ]
        for model in models_to_clear:
            model.objects.all().delete()
    
    def create_levels(self):
        """Create default levels"""
        levels = [
            {'name': 'beginner', 'position': 1, 'passing_score': 80},
            {'name': 'intermediate', 'position': 2, 'passing_score': 80},
            {'name': 'advanced', 'position': 3, 'passing_score': 80}
        ]

        return [Level.objects.create(**level_data) for level_data in levels]
    
    def generate_lessons(self, level):
        """Generate lessons for a specific level"""
        lesson_titles = [
            f"{level.name.capitalize()} Lesson {i+1}" 
            for i in range(10)  # 10 lessons per level
        ]
        
        return [
            Lesson.objects.create(
                title=title, 
                level=level, 
                position=i+1, 
                description=self.generate_lesson_description()
            ) 
            for i, title in enumerate(lesson_titles)
        ]
    
    def generate_lesson_description(self):
        """Generate a lesson description using text generation"""
        prompt = "Write a short description for an English language learning lesson:"
        description = self.generator(prompt, max_length=100)[0]['generated_text']
        self.stdout.write(f"Generated description: {description}")  # Debugging statement
        return description.replace(prompt, '').strip()
    
    def generate_flashcards(self, lesson):
        """Generate flashcards for a lesson"""
        flashcards = []
        words = self.extract_vocabulary()
        
        for i, word_data in enumerate(words):
            flashcard = Flashcard.objects.create(
                lesson=lesson,
                word=word_data['word'],
                definition=word_data['definition'],
                example=word_data['example'],
                fill_in_blank_template=self.create_fill_in_blank(word_data['example'], word_data['word']),
                position=i+1,
                is_last_card=(i == len(words) - 1)
            )
            flashcards.append(flashcard)
        
        return flashcards
    
    def generate_quiz(self, lesson, flashcards):
        """Generate a quiz from lesson flashcards"""
        quiz = Quiz.objects.create(
            lesson=lesson,
            title=f"Quiz for {lesson.title}",
            total_questions=10,
            passing_score=80
        )
        
        # Generate quiz questions from flashcard examples
        for i, flashcard in enumerate(random.sample(flashcards, 10)):
            QuizQuestion.objects.create(
                quiz=quiz,
                question_text=f"Fill in the blank: {flashcard.fill_in_blank_template}",
                correct_answer=flashcard.word,
                position=i+1,
                blank_placeholder='______'
            )
        
        return quiz
    
    def generate_level_tests(self, levels):
        """Generate level tests for progression"""
        for i, current_level in enumerate(levels[:-1]):
            source_level = levels[i]
            target_level = levels[i+1]
            
            # Get quiz questions from source level lessons
            source_quiz_questions = QuizQuestion.objects.filter(
                quiz__lesson__level=source_level
            )
            
            level_test = LevelTest.objects.create(
                level=target_level,
                generated_from_level=source_level,
                total_questions=10,
                passing_score=80
            )
            
            # Randomly select questions for level test
            test_questions = random.sample(list(source_quiz_questions), 10)
            
            for j, quiz_question in enumerate(test_questions):
                LevelTestQuestion.objects.create(
                    level_test=level_test,
                    question_text=quiz_question.question_text,
                    correct_answer=quiz_question.correct_answer,
                    position=j+1,
                    blank_placeholder='______'
                )
    
    def extract_vocabulary(self):
        """Extract vocabulary using NLP techniques"""
        sample_texts = [
            "Today is a beautiful day for learning English.",
            "I enjoy studying new words and their meanings.",
            "Language learning requires practice and dedication."
        ]
        
        words = []
        for text in sample_texts:
            doc = self.nlp(text)
            for token in doc:
                if token.pos_ in ['NOUN', 'VERB', 'ADJ']:
                    definition = self.generate_definition(token.text)
                    example = self.generate_example(token.text)
                    words.append({
                        'word': token.text,
                        'definition': definition,
                        'example': example
                    })
        
        return words[:10]  # Limit to 10 words
    
    def generate_definition(self, word):
        """Generate a definition using text generation"""
        prompt = f"Define the word '{word}':"
        definition = self.generator(prompt, max_length=50)[0]['generated_text']
        self.stdout.write(f"Generated definition: {definition}")  # Debugging statement
        return definition.replace(prompt, '').strip()
    
    def create_fill_in_blank(self, example, word):
        """Create a fill-in-the-blank template"""
        return example.replace(word, '______')
    
    def generate_example(self, word):
        """Generate an example sentence"""
        prompt = f"Create an example sentence using the word '{word}':"
        example = self.generator(prompt, max_length=100)[0]['generated_text']
        self.stdout.write(f"Generated example: {example}")  # Debugging statement
        return example.replace(prompt, '').strip()
