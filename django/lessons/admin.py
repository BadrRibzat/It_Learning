from django.contrib import admin
from .models import Lesson

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'level', 'created_at')
    search_fields = ('title', 'description')
    list_filter = ('level', 'created_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description')
        }),
        ('Advanced Information', {
            'fields': ('level', 'content', 'created_at')
        }),
    )

