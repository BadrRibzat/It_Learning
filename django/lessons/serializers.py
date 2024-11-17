from .validators import FillInTheBlankValidator
from rest_framework import serializers
from .models import (
    Level, Lesson, Flashcard, Quiz, QuizQuestion,
    LevelTest, LevelTestQuestion,
    UserProgress, UserFlashcardProgress,
    UserQuizAttempt, UserLevelTestProgress
    )

class FlashcardSubmissionSerializer(serializers.Serializer):
    flashcard_id = serializers.IntegerField()
    answer = serializers.CharField()

    def validate_answer(self, value):
        # Get the correct answer from the flashcard
        flashcard_id = self.initial_data.get('flashcard_id')
        flashcard = Flashcard.objects.get(id=flashcard_id)

        if not FillInTheBlankValidator.validate_answer(value, flashcard.word):
            raise serializers.ValidationError("Answer does not match the expected word.")

        return value

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
        user = self.context.get('request').user
        return obj.can_user_access(user)

class FlashcardSerializer(serializers.ModelSerializer):
    adaptive_difficulty = serializers.SerializerMethodField()

    class Meta:
        model = Flashcard
        fields = [
            'id', 'word', 'definition', 'example', 'translation',
            'fill_in_blank_template', 'adaptive_difficulty', 'is_last_card', 'order'
        ]

    def get_adaptive_difficulty(self, obj):
        user = self.context.get('request').user

        if not obj.lesson.can_user_access(user):
            return 'beginner'

        completed_flashcards = UserFlashcardProgress.objects.filter(
            user=user,
            flashcard__lesson=obj.lesson,
            is_completed=True
        ).count()

        total_flashcards = Flashcard.objects.filter(lesson=obj.lesson).count()

        completion_percentage = (completed_flashcards / total_flashcards) * 100 if total_flashcards > 0 else 0

        if completion_percentage < 30:
            return 'beginner'
        elif completion_percentage < 70:
            return 'intermediate'
        else:
            return 'advanced'

class FlashcardSubmissionSerializer(serializers.Serializer):
    flashcard_id = serializers.IntegerField()
    answer = serializers.CharField()
    
    def validate_answer(self, value):
        # Add additional validation if needed
        return value.strip()

class QuizQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestion
        fields = [
            'id', 'question_text',
            'correct_answer',
            'order', 'blank_placeholder'
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
            'id', 'title', 'level', 'content', 'difficulty', 'is_unlocked',
            'points_to_complete', 'flashcard_count', 'flashcards', 'quizzes', 'is_accessible'
        ]

    def get_is_accessible(self, obj):
        user = self.context.get('request').user
        return obj.can_user_access(user)

class LevelTestQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LevelTestQuestion
        fields = [
            'id', 'question_text',
            'correct_answer',
            'order', 'blank_placeholder'
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
            'completed_at', 'time_spent'
        ]

class UserFlashcardProgressSerializer(serializers.ModelSerializer):
    flashcard = FlashcardSerializer(read_only=True)

    class Meta:
        model = UserFlashcardProgress
        fields = [
            'flashcard', 'is_completed',
            'attempts', 'last_attempt',
            'points_earned', 'time_spent'
        ]

class UserQuizAttemptSerializer(serializers.ModelSerializer):
    quiz = QuizSerializer(read_only=True)

    class Meta:
        model = UserQuizAttempt
        fields = [
            'quiz', 'total_score',
            'is_passed', 'attempts',
            'completed_at', 'time_spent'
        ]

class UserLevelTestProgressSerializer(serializers.ModelSerializer):
    level_test = LevelTestSerializer(read_only=True)

    class Meta:
        model = UserLevelTestProgress
        fields = [
            'level_test', 'is_correct',
            'user_answer', 'attempted_at',
            'time_spent'
        ]

class QuizSubmissionSerializer(serializers.Serializer):
    answers = FlashcardSubmissionSerializer(many=True)

class LevelTestSubmissionSerializer(serializers.Serializer):
    answers = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        )
    )

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
    learning_streak = serializers.IntegerField()
    total_learning_time = serializers.DictField()

class ComprehensiveLearningReportSerializer(serializers.Serializer):
    """Serializer for the comprehensive learning report"""
    overall_progress = serializers.DictField()
    lessons = serializers.DictField()
    level_tests = serializers.DictField()
    performance_metrics = serializers.DictField()

class UserLearningMetricsSerializer(serializers.Serializer):
    """Serializer for comprehensive learning metrics"""
    learning_streak = serializers.IntegerField()
    total_learning_time = serializers.DictField()
