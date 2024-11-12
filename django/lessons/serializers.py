from rest_framework import serializers
from .models import (
    Level, Lesson, Flashcard, Quiz, QuizQuestion, 
    UserProgress, LevelTest, LevelTestQuestion
)

class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ['id', 'name', 'level_order']

class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = ['id', 'word', 'definition', 'example', 'translation']

class QuizQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestion
        fields = ['id', 'question_text', 'correct_answer', 'options']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuizQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'lesson', 'title', 'passing_score', 'questions']

class LessonSerializer(serializers.ModelSerializer):
    flashcards = FlashcardSerializer(many=True, read_only=True)
    quizzes = QuizSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'level', 'content', 'difficulty', 'is_unlocked', 'flashcards', 'quizzes']

class LevelTestQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LevelTestQuestion
        fields = ['id', 'question_text', 'correct_answer', 'options']

class LevelTestSerializer(serializers.ModelSerializer):
    questions = LevelTestQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = LevelTest
        fields = ['id', 'level', 'title', 'passing_score', 'questions']

class UserProgressSerializer(serializers.ModelSerializer):
    lesson = LessonSerializer(read_only=True)

    class Meta:
        model = UserProgress
        fields = ['id', 'user', 'lesson', 'completed', 'score', 'total_questions', 'completed_at']
