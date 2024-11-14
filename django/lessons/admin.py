from django.contrib import admin
from .models import (
    Level, Lesson, Flashcard, Quiz, QuizQuestion,
    LevelTest, LevelTestQuestion,
    UserProgress, UserFlashcardProgress,
    UserQuizAttempt, UserLevelTestProgress
)

@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'level_order', 'lesson_count',
        'points_to_advance', 'difficulty'
    )
    search_fields = ('name',)
    ordering = ('level_order',)

    def lesson_count(self, obj):
        return obj.lessons.count()
    lesson_count.short_description = 'Number of Lessons'

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'level', 'difficulty',
        'flashcard_count', 'quiz_count',
        'is_unlocked', 'points_to_complete'
    )
    list_filter = ('level', 'difficulty', 'is_unlocked')
    search_fields = ('title', 'content')
    list_editable = ('is_unlocked',)

    def flashcard_count(self, obj):
        return obj.flashcards.count()
    flashcard_count.short_description = 'Flashcards'

    def quiz_count(self, obj):
        return obj.quizzes.count()
    quiz_count.short_description = 'Quizzes'

@admin.register(Flashcard)
class FlashcardAdmin(admin.ModelAdmin):
    list_display = ('word', 'lesson', 'definition', 'translation')
    list_filter = ('lesson__level', 'lesson')
    search_fields = ('word', 'definition', 'translation')

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'lesson', 'passing_score', 'question_count')
    list_filter = ('lesson__level',)
    search_fields = ('title',)

    def question_count(self, obj):
        return obj.questions.count()
    question_count.short_description = 'Number of Questions'

@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ('question_text', 'quiz', 'correct_answer')
    list_filter = ('quiz__lesson__level',)
    search_fields = ('question_text',)

@admin.register(LevelTest)
class LevelTestAdmin(admin.ModelAdmin):
    list_display = ('title', 'level', 'passing_score', 'question_count')
    list_filter = ('level',)
    search_fields = ('title',)

    def question_count(self, obj):
        return obj.questions.count()
    question_count.short_description = 'Number of Questions'

@admin.register(LevelTestQuestion)
class LevelTestQuestionAdmin(admin.ModelAdmin):
    list_display = ('question_text', 'level_test', 'correct_answer')
    list_filter = ('level_test__level',)
    search_fields = ('question_text',)

@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'completed', 'score', 'completed_at')
    list_filter = ('completed', 'lesson__level')
    search_fields = ('user__username', 'lesson__title')

@admin.register(UserFlashcardProgress)
class UserFlashcardProgressAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'flashcard', 'completed',
        'attempts', 'points_earned', 'last_attempt'
    )
    list_filter = ('completed', 'flashcard__lesson__level')
    search_fields = ('user__username', 'flashcard__word')

@admin.register(UserQuizAttempt)
class UserQuizAttemptAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'quiz', 'total_score',
        'is_passed', 'attempts', 'completed_at'
    )
    list_filter = ('is_passed', 'quiz__lesson__level')
    search_fields = ('user__username', 'quiz__title')

@admin.register(UserLevelTestProgress)
class UserLevelTestProgressAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'level_test', 'is_passed',
        'score', 'total_questions', 'completed_at'
    )
    list_filter = ('is_passed', 'level_test__level')
    search_fields = ('user__username', 'level_test__level__name')

# Custom Admin Site Configuration
admin.site.site_header = 'Learn English Platform Admin'
admin.site.site_title = 'Learn English Platform'
admin.site.index_title = 'Welcome to Learn English Admin Dashboard'
