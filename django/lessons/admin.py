from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Level, Lesson, Flashcard, Quiz, QuizQuestion, 
    LevelTest, LevelTestQuestion, 
    UserProgress, UserLevelProgress
)

@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ('name', 'level_order', 'lesson_count')
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
        'is_unlocked'
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
    list_display = (
        'word', 'lesson', 'definition', 
        'translation', 'preview_example'
    )
    list_filter = ('lesson', 'lesson__level')
    search_fields = ('word', 'definition', 'example')

    def preview_example(self, obj):
        return obj.example[:50] + '...' if len(obj.example) > 50 else obj.example
    preview_example.short_description = 'Example'

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'lesson', 'passing_score', 
        'question_count'
    )
    list_filter = ('lesson', 'lesson__level')
    search_fields = ('title',)

    def question_count(self, obj):
        return obj.questions.count()
    question_count.short_description = 'Questions'

@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = (
        'preview_question', 'quiz', 
        'correct_answer', 'option_count'
    )
    list_filter = ('quiz', 'quiz__lesson')
    search_fields = ('question_text', 'correct_answer')

    def preview_question(self, obj):
        return obj.question_text[:50] + '...' if len(obj.question_text) > 50 else obj.question_text
    preview_question.short_description = 'Question'

    def option_count(self, obj):
        return len(obj.options)
    option_count.short_description = 'Options'

@admin.register(LevelTest)
class LevelTestAdmin(admin.ModelAdmin):
    list_display = (
        'level', 'title', 'passing_score', 
        'question_count'
    )
    list_filter = ('level',)
    search_fields = ('title',)

    def question_count(self, obj):
        return obj.questions.count()
    question_count.short_description = 'Questions'

@admin.register(LevelTestQuestion)
class LevelTestQuestionAdmin(admin.ModelAdmin):
    list_display = (
        'preview_question', 'level_test', 
        'correct_answer', 'option_count'
    )
    list_filter = ('level_test', 'level_test__level')
    search_fields = ('question_text', 'correct_answer')

    def preview_question(self, obj):
        return obj.question_text[:50] + '...' if len(obj.question_text) > 50 else obj.question_text
    preview_question.short_description = 'Question'

    def option_count(self, obj):
        return len(obj.options)
    option_count.short_description = 'Options'

@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'lesson', 'completed', 
        'score', 'total_questions', 
        'completed_at'
    )
    list_filter = ('completed', 'lesson__level')
    search_fields = ('user__username', 'lesson__title')
    readonly_fields = ('completed_at',)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'lesson')

@admin.register(UserLevelProgress)
class UserLevelProgressAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'level', 'completed', 
        'score', 'total_questions', 
        'completed_at'
    )
    list_filter = ('completed', 'level')
    search_fields = ('user__username', 'level__name')
    readonly_fields = ('completed_at',)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'level')

# Custom Admin Site Configuration
admin.site.site_header = 'Learn English Admin'
admin.site.site_title = 'Learn English Platform'
admin.site.index_title = 'Welcome to Learn English Admin Dashboard'
