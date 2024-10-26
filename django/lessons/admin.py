from django.contrib import admin
from .models import Level, Lesson, Flashcard, Quiz, UserQuizAttempt, UserProgress, QuizQuestion, LevelTest, LevelTestQuestion, UserFlashcardProgress
from django.shortcuts import render

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'level', 'level_order', 'content')
    list_filter = ('level',)
    search_fields = ('title', 'content')

    def custom_view(self, request):
        lessons = list(Lesson.objects.all())  # Convert QuerySet to a list
        context = {'lessons': lessons}
        return render(request, 'admin/custom_lesson_view.html', context)

    def get_urls(self):
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path('custom-view/', self.admin_site.admin_view(self.custom_view), name='custom_lesson_view'),
        ]
        return custom_urls + urls

class FlashcardAdmin(admin.ModelAdmin):
    list_display = ('word', 'lesson', 'definition')  # Corrected field names
    list_filter = ('lesson',)
    search_fields = ('word', 'definition')  # Corrected field names

class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'lesson')
    list_filter = ('lesson',)
    search_fields = ('title',)

class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ('question_text', 'quiz', 'correct_answer')  # Corrected field name
    list_filter = ('quiz',)
    search_fields = ('question_text',)  # Corrected field name

class LevelTestAdmin(admin.ModelAdmin):
    list_display = ('level',)
    list_filter = ('level',)
    search_fields = ('level__name',)

class LevelTestQuestionAdmin(admin.ModelAdmin):
    list_display = ('question_text', 'level_test', 'correct_answer')  # Corrected field name
    list_filter = ('level_test',)
    search_fields = ('question_text',)  # Corrected field name

class UserQuizAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'quiz', 'score', 'date_attempted')
    list_filter = ('user', 'quiz')
    search_fields = ('user__username', 'quiz__title')

class UserProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'completed', 'date_completed')
    list_filter = ('completed',)
    search_fields = ('user__username', 'lesson__title')

admin.site.register(Level)
admin.site.register(Flashcard, FlashcardAdmin)
admin.site.register(Quiz, QuizAdmin)
admin.site.register(QuizQuestion, QuizQuestionAdmin)
admin.site.register(LevelTest, LevelTestAdmin)
admin.site.register(LevelTestQuestion, LevelTestQuestionAdmin)
admin.site.register(UserQuizAttempt, UserQuizAttemptAdmin)
admin.site.register(UserProgress, UserProgressAdmin)
