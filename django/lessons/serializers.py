from rest_framework import serializers
from .models import Level, Lesson, Flashcard, Quiz, QuizQuestion, LevelTest, LevelTestQuestion, UserProgress, UserFlashcardProgress, UserQuizAttempt

class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = ['id', 'word', 'definition', 'example', 'fill_in_blank_template', 'position', 'is_last_card']

class QuizQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestion
        fields = ['id', 'question_text', 'blank_placeholder']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuizQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'passing_score', 'total_questions', 'questions']

class LessonSerializer(serializers.ModelSerializer):
    flashcards = FlashcardSerializer(many=True, read_only=True)
    quizzes = QuizSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'description', 'position', 'flashcards', 'quizzes']

class LevelTestQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LevelTestQuestion
        fields = ['id', 'question_text', 'blank_placeholder']

class LevelTestSerializer(serializers.ModelSerializer):
    questions = LevelTestQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = LevelTest
        fields = ['id', 'level', 'passing_score', 'total_questions', 'questions']

class LevelSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Level
        fields = ['id', 'name', 'description', 'position', 'lessons']

class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = ['lesson', 'level', 'completed_flashcards', 'quiz_score', 'quiz_completed', 'level_test_score', 'level_unlocked']

class FlashcardSubmissionSerializer(serializers.Serializer):
    flashcard_id = serializers.IntegerField()
    user_answer = serializers.CharField(max_length=200)

class QuizSubmissionSerializer(serializers.Serializer):
    quiz_id = serializers.IntegerField()
    answers = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField(max_length=200)
        )
    )

class LevelTestSubmissionSerializer(serializers.Serializer):
    level_test_id = serializers.IntegerField()
    answers = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField(max_length=200)
        )
    )

class UserFlashcardProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFlashcardProgress
        fields = ['user', 'flashcard', 'is_completed', 'completed_at']

class UserQuizAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserQuizAttempt
        fields = ['user', 'quiz', 'score', 'is_passed', 'attempted_at']
