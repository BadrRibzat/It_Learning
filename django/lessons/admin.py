from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Level, Lesson, Flashcard, Quiz, QuizQuestion, 
    LevelTest, LevelTestQuestion, 
    UserProgress, UserLevelProgress,
    UserFlashcardProgress, UserQuizAttempt
)
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()

class LevelAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'level_order', 'lesson_count', 
        'points_to_advance', 'difficulty_range'
    )
    search_fields = ('name',)
    ordering = ('level_order',)

    def lesson_count(self, obj):
        return obj.lessons.count()
    lesson_count.short_description = 'Number of Lessons'

    def difficulty_range(self, obj):
        difficulties = set(obj.lessons.values_list('difficulty', flat=True))
        return ', '.join(sorted(difficulties))
    difficulty_range.short_description = 'Difficulties'

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

class UserFlashcardProgressAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'flashcard', 'is_completed', 
        'attempts', 'points_earned', 'last_attempt'
    )
    list_filter = ('is_completed', 'flashcard__lesson__level')
    search_fields = ('user__username', 'flashcard__word')

class UserQuizAttemptAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'quiz', 'total_score', 
        'is_passed', 'attempts', 'completed_at'
    )
    list_filter = ('is_passed', 'quiz__lesson__level')
    search_fields = ('user__username', 'quiz__title')

class UserAdmin(admin.ModelAdmin):
    actions = ['delete_test_users']

    def delete_test_users(self, request, queryset):
        # Filter and delete test users based on specific criteria
        test_users = queryset.filter(
            Q(email__startswith='testuser') | 
            Q(username__startswith='testuser')
        )
        count = test_users.count()
        test_users.delete()
        self.message_user(request, f'{count} test users were deleted.')
    delete_test_users.short_description = "Delete test users"

# Custom Admin Site Configuration
admin.site.site_header = 'Learn English Admin'
admin.site.site_title = 'Learn English Platform'
admin.site.index_title = 'Welcome to Learn English Admin Dashboard'
