from django.contrib import admin
from django.utils.html import format_html
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User, ProfilePicture, Note,
    EmailVerificationToken, PasswordResetToken
)
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    actions = ['delete_test_users', 'reset_user_progress']

    def delete_test_users(self, request, queryset):
        test_users = queryset.filter(
            Q(email__startswith='testuser') |
            Q(username__startswith='testuser') |
            Q(email__contains='@example.com')
        ).exclude(is_superuser=True)

        count = test_users.count()
        test_users.delete()
        self.message_user(request, f'{count} test users were deleted.')

    delete_test_users.short_description = "Delete test users"

    def reset_user_progress(self, request, queryset):
        for user in queryset:
            user.reset_progress()
        self.message_user(request, f'{queryset.count()} users\' progress reset.')

    reset_user_progress.short_description = "Reset selected users' learning progress"

    list_display = BaseUserAdmin.list_display + (
        'points', 'level_display', 'language', 'date_joined'
    )
    list_filter = BaseUserAdmin.list_filter + (
        'level', 'language'
    )

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Learning Progress', {
            'fields': ('points', 'level', 'language')
        }),
    )

    def level_display(self, obj):
        return obj.level.name if obj.level else 'No Level'
    level_display.short_description = 'Level'

@admin.register(ProfilePicture)
class ProfilePictureAdmin(admin.ModelAdmin):
    list_display = ('user', 'image_preview')
    search_fields = ('user__username',)
    list_filter = ('user__level',)

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                f'<img src="{obj.image.url}" style="max-height: 100px; max-width: 100px; border-radius: 50%;" />'
            )
        return 'No Image'
    image_preview.short_description = 'Profile Picture'

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'title', 'note_type', 
        'preview_content', 'created_at', 'updated_at'
    )
    list_filter = ('note_type', 'created_at')
    search_fields = ('user__username', 'title', 'content')
    readonly_fields = ('created_at', 'updated_at')

    def preview_content(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    preview_content.short_description = 'Content Preview'

@admin.register(EmailVerificationToken)
class EmailVerificationTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token', 'created_at', 'expires_at', 'is_valid')
    search_fields = ('user__username', 'user__email')
    list_filter = ('created_at', 'expires_at')

    def is_valid(self, obj):
        return obj.is_valid()
    is_valid.boolean = True
    is_valid.short_description = 'Valid'

@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token', 'created_at', 'expires_at', 'is_valid')
    search_fields = ('user__username', 'user__email')
    list_filter = ('created_at', 'expires_at')

    def is_valid(self, obj):
        return obj.is_valid()
    is_valid.boolean = True
    is_valid.short_description = 'Valid'

# Custom Admin Site Configuration
admin.site.site_header = 'Learn English Platform Admin'
admin.site.site_title = 'Learn English Platform'
admin.site.index_title = 'Welcome to Learn English Admin Dashboard'
