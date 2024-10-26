<<<<<<< HEAD
# File: accounts/admin.py
from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'language')
    search_fields = ('username', 'email')

=======
from django.contrib import admin
from .models import User, Badge, UserBadge, ProfilePicture, Note
from lessons.models import UserFlashcardProgress, UserLevelProgress

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'points', 'level', 'language')
    list_filter = ('level', 'language')
    search_fields = ('username', 'email')

class BadgeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ('user', 'badge', 'date_earned')
    list_filter = ('user', 'badge')
    search_fields = ('user__username', 'badge__name')

class ProfilePictureAdmin(admin.ModelAdmin):
    list_display = ('user', 'image')
    search_fields = ('user__username',)

class NoteAdmin(admin.ModelAdmin):
    list_display = ('user', 'content', 'created_at', 'note_type')
    list_filter = ('note_type',)
    search_fields = ('user__username', 'content')

class UserFlashcardProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'flashcard', 'completed', 'correct_attempts')
    list_filter = ('completed',)
    search_fields = ('user__username', 'flashcard__word')

class UserLevelProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'level', 'completed', 'date_completed')
    list_filter = ('completed',)
    search_fields = ('user__username', 'level__name')

admin.site.register(User, UserAdmin)
admin.site.register(Badge, BadgeAdmin)
admin.site.register(UserBadge, UserBadgeAdmin)
admin.site.register(ProfilePicture, ProfilePictureAdmin)
admin.site.register(Note, NoteAdmin)
admin.site.register(UserFlashcardProgress, UserFlashcardProgressAdmin)
admin.site.register(UserLevelProgress, UserLevelProgressAdmin)
>>>>>>> ac2b48c (Add core backend files and essential components)
