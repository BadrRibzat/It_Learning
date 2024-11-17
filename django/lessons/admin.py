from django.contrib import admin
from .models import (
        Level, 
        Lesson, 
        Flashcard, 
        Quiz, 
        QuizQuestion, 
        LevelTest, 
        LevelTestQuestion, 
        UserProgress, 
        UserFlashcardProgress, 
        UserQuizAttempt
        )

# Register the Level model
@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ('name', 'level_order', 'points_to_advance', 'difficulty', 'unlocked_by_test')
    list_filter = ('difficulty', 'unlocked_by_test')
    search_fields = ('name',)

# Register the Lesson model
@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'level', 'difficulty', 'is_unlocked', 'points_to_complete', 'flashcard_count')
    list_filter = ('level', 'difficulty', 'is_unlocked')
    search_fields = ('title', 'content')

# Register the Flashcard model
@admin.register(Flashcard)
class FlashcardAdmin(admin.ModelAdmin):
    list_display = ('word', 'lesson', 'definition', 'translation', 'order')
    list_filter = ('lesson__level',)
    search_fields = ('word', 'definition', 'translation')

# Register the Quiz model
@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'lesson', 'passing_score', 'total_questions')
    list_filter = ('lesson__level',)
    search_fields = ('title', 'lesson__title')

# Register the QuizQuestion model
@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ('question_text', 'quiz', 'correct_answer', 'order')
    list_filter = ('quiz__lesson__level',)
    search_fields = ('question_text', 'correct_answer')

# Register the LevelTest model
@admin.register(LevelTest)
class LevelTestAdmin(admin.ModelAdmin):
    list_display = ('title', 'level', 'passing_score', 'total_questions')
    list_filter = ('level',)
    search_fields = ('title', 'level__name')

# Register the LevelTestQuestion model
@admin.register(LevelTestQuestion)
class LevelTestQuestionAdmin(admin.ModelAdmin):
    list_display = ('question_text', 'level_test', 'correct_answer', 'order')
    list_filter = ('level_test__level',)
    search_fields = ('question_text', 'correct_answer')

# Register the UserProgress model
@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'score', 'completed', 'is_passed', 'time_spent', 'completed_at')
    list_filter = ('user__level', 'completed', 'is_passed', 'lesson')
    search_fields = ('user__username', 'lesson__title')

# Register the UserFlashcardProgress model
@admin.register(UserFlashcardProgress)
class UserFlashcardProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'flashcard', 'is_completed', 'attempts', 'points_earned', 'last_attempt')
    list_filter = ('flashcard__lesson__level', 'is_completed')
    search_fields = ('user__username', 'flashcard__word')

# Register the UserQuizAttempt model
@admin.register(UserQuizAttempt)
class UserQuizAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'quiz', 'total_score', 'is_passed', 'attempts', 'completed_at')
    list_filter = ('quiz__lesson__level', 'is_passed')
    search_fields = ('user__username', 'quiz__title')
