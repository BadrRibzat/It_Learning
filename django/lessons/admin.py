from django.contrib import admin
from .models import Level, Lesson, Flashcard, Quiz, QuizQuestion, LevelTest, LevelTestQuestion, UserProgress, UserFlashcardProgress, UserQuizAttempt

class FlashcardInline(admin.TabularInline):
    model = Flashcard
    extra = 1

class QuizQuestionInline(admin.TabularInline):
    model = QuizQuestion
    extra = 1

class LevelTestQuestionInline(admin.TabularInline):
    model = LevelTestQuestion
    extra = 1

class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'level', 'position', 'description']
    list_filter = ['level']
    search_fields = ['title', 'description']
    inlines = [FlashcardInline]

class LevelAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'position', 'passing_score']
    list_filter = ['name']
    search_fields = ['name', 'description']

class QuizAdmin(admin.ModelAdmin):
    list_display = ['title', 'lesson', 'passing_score', 'total_questions']
    list_filter = ['lesson']
    search_fields = ['title']
    inlines = [QuizQuestionInline]

class LevelTestAdmin(admin.ModelAdmin):
    list_display = ['level', 'generated_from_level', 'passing_score', 'total_questions']
    list_filter = ['level']
    search_fields = ['level__name']
    inlines = [LevelTestQuestionInline]

class UserProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'lesson', 'level', 'completed_flashcards', 'quiz_score', 'quiz_completed', 'level_test_score', 'level_unlocked', 'last_updated']
    list_filter = ['level', 'quiz_completed', 'level_unlocked']
    search_fields = ['user__username', 'lesson__title']

class UserFlashcardProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'flashcard', 'is_completed', 'completed_at']
    list_filter = ['is_completed']
    search_fields = ['user__username', 'flashcard__word']

class UserQuizAttemptAdmin(admin.ModelAdmin):
    list_display = ['user', 'quiz', 'score', 'is_passed', 'attempted_at']
    list_filter = ['is_passed']
    search_fields = ['user__username', 'quiz__title']

admin.site.register(Level, LevelAdmin)
admin.site.register(Lesson, LessonAdmin)
admin.site.register(Flashcard)
admin.site.register(Quiz, QuizAdmin)
admin.site.register(QuizQuestion)
admin.site.register(LevelTest, LevelTestAdmin)
admin.site.register(LevelTestQuestion)
admin.site.register(UserProgress, UserProgressAdmin)
admin.site.register(UserFlashcardProgress, UserFlashcardProgressAdmin)
admin.site.register(UserQuizAttempt, UserQuizAttemptAdmin)
