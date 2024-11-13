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
        fields = ['id', 'word', 'definition', 'example', 'translation', 'lesson']

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
    level_name = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'level', 'level_name', 'content', 'difficulty', 'is_unlocked', 'flashcards', 'quizzes']

    def get_level_name(self, obj):
        return obj.level.name if obj.level else None

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

class UserFlashcardProgressSerializer(serializers.ModelSerializer):
    flashcard = FlashcardSerializer(read_only=True)
    
    class Meta:
        model = UserFlashcardProgress
        fields = [
            'flashcard', 
            'is_completed', 
            'attempts', 
            'points_earned'
        ]

class UserQuizAttemptSerializer(serializers.ModelSerializer):
    quiz = QuizSerializer(read_only=True)
    
    class Meta:
        model = UserQuizAttempt
        fields = [
            'quiz', 
            'total_score', 
            'is_passed', 
            'attempts', 
            'completed_at'
        ]
