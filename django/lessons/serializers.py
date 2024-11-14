from rest_framework import serializers
from .models import (
    Level, Lesson, Flashcard, Quiz, QuizQuestion, 
    LevelTest, LevelTestQuestion,
    UserProgress, UserFlashcardProgress, 
    UserQuizAttempt, UserLevelTestProgress
)

class LevelSerializer(serializers.ModelSerializer):
    is_accessible = serializers.SerializerMethodField()
    
    class Meta:
        model = Level
        fields = [
            'id', 'name', 'level_order', 
            'points_to_advance', 'difficulty', 
            'unlocked_by_test', 'is_accessible'
        ]
    
    def get_is_accessible(self, obj):
        # Check if the level is accessible for the current user
        user = self.context.get('request').user
        return obj.can_user_access(user)

class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = [
            'id', 'word', 'definition', 
            'example', 'translation', 
            'question', 'is_last_card', 
            'order'
        ]

class QuizQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestion
        fields = [
            'id', 'question_text', 
            'correct_answer', 'options', 
            'order'
        ]

class QuizSerializer(serializers.ModelSerializer):
    questions = QuizQuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Quiz
        fields = [
            'id', 'lesson', 'title', 
            'passing_score', 'total_questions', 
            'questions'
        ]

class LessonSerializer(serializers.ModelSerializer):
    flashcards = FlashcardSerializer(many=True, read_only=True)
    quizzes = QuizSerializer(many=True, read_only=True)
    is_accessible = serializers.SerializerMethodField()
    
    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'level', 
            'content', 'difficulty', 
            'is_unlocked', 'points_to_complete', 
            'flashcard_count', 'flashcards', 
            'quizzes', 'is_accessible'
        ]
    
    def get_is_accessible(self, obj):
        # Check if the lesson is accessible for the current user
        user = self.context.get('request').user
        return obj.can_user_access(user)

class LevelTestQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LevelTestQuestion
        fields = [
            'id', 'question_text', 
            'correct_answer', 'options', 
            'order'
        ]

class LevelTestSerializer(serializers.ModelSerializer):
    questions = LevelTestQuestionSerializer(many=True, read_only=True)
    is_accessible = serializers.SerializerMethodField()
    
    class Meta:
        model = LevelTest
        fields = [
            'id', 'level', 'title', 
            'passing_score', 'total_questions', 
            'questions', 'is_accessible'
        ]
    
    def get_is_accessible(self, obj):
        # Check if the level test is accessible for the current user
        user = self.context.get('request').user
        return obj.level.can_user_access(user)

class UserProgressSerializer(serializers.ModelSerializer):
    lesson = LessonSerializer(read_only=True)
    
    class Meta:
        model = UserProgress
        fields = [
            'id', 'user', 'lesson', 
            'completed', 'score', 
            'total_questions', 'correct_answers', 
            'completed_at'
        ]

class UserFlashcardProgressSerializer(serializers.ModelSerializer):
    flashcard = FlashcardSerializer(read_only=True)
    
    class Meta:
        model = UserFlashcardProgress
        fields = [
            'flashcard', 'completed', 
            'attempts', 'last_attempt', 
            'points_earned'
        ]

class UserQuizAttemptSerializer(serializers.ModelSerializer):
    quiz = QuizSerializer(read_only=True)
    
    class Meta:
        model = UserQuizAttempt
        fields = [
            'quiz', 'total_score', 
            'is_passed', 'attempts', 
            'completed_at'
        ]

class UserLevelTestProgressSerializer(serializers.ModelSerializer):
    level_test = LevelTestSerializer(read_only=True)
    
    class Meta:
        model = UserLevelTestProgress
        fields = [
            'level_test', 'is_passed', 
            'score', 'total_questions', 
            'completed_at'
        ]

# Detailed submission serializers
class FlashcardSubmissionSerializer(serializers.Serializer):
    flashcard_id = serializers.IntegerField()
    answer = serializers.CharField()

class QuizSubmissionSerializer(serializers.Serializer):
    answers = FlashcardSubmissionSerializer(many=True)

class LevelTestSubmissionSerializer(serializers.Serializer):
    answers = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        )
    )

# Progress tracking serializers
class UserLearningProgressSerializer(serializers.Serializer):
    level = serializers.IntegerField()
    level_name = serializers.CharField()
    points = serializers.IntegerField()
    completed_lessons = serializers.IntegerField()
    total_lessons = serializers.IntegerField()
    lesson_progress_percentage = serializers.FloatField()
    passed_quizzes = serializers.IntegerField()
    total_quizzes = serializers.IntegerField()
    quiz_progress_percentage = serializers.FloatField()
    completed_flashcards = serializers.IntegerField()
    total_flashcards = serializers.IntegerField()
    flashcard_progress_percentage = serializers.FloatField()
