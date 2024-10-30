from rest_framework import serializers
from .models import Level, Lesson, Flashcard, Quiz, QuizQuestion, UserProgress, UserFlashcardProgress, UserQuizAttempt, UserLevelProgress, LevelTest, LevelTestQuestion

class NestedLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'difficulty']

class LevelSerializer(serializers.ModelSerializer):
    lessons = NestedLessonSerializer(many=True, read_only=True)

    class Meta:
        model = Level
        fields = ['id', 'name', 'level_order', 'lessons']

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'level', 'level_order', 'content', 'difficulty']

class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = '__all__'

class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = '__all__'

class QuizQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestion
        fields = '__all__'

class LevelTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LevelTest
        fields = '__all__'

class LevelTestQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LevelTestQuestion
        fields = '__all__'

class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = ['id', 'user', 'lesson', 'completed', 'date_completed', 'correct_answers', 'total_questions']

class UserFlashcardProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFlashcardProgress
        fields = '__all__'

class UserQuizAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserQuizAttempt
        fields = '__all__'

class UserLevelProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLevelProgress
        fields = ['id', 'user', 'level', 'completed', 'date_completed', 'correct_answers', 'total_questions']
