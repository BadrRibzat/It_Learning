from django.contrib import admin
from django.utils.html import format_html
from .models import User, ProfilePicture, Note

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'points', 'level', 'language')
    list_filter = ('level', 'language')
    search_fields = ('username', 'email')
    readonly_fields = ('points', 'level')

@admin.register(ProfilePicture)
class ProfilePictureAdmin(admin.ModelAdmin):
    list_display = ('user', 'image_preview')
    search_fields = ('user__username',)

    def image_preview(self, obj):
        if obj.image:
            return format_html(f'<img src="{obj.image.url}" style="max-height: 100px; max-width: 100px;" />')
        return 'No Image'
    image_preview.short_description = 'Profile Picture'

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'note_type', 'created_at', 'updated_at')
    list_filter = ('note_type', 'created_at')
    search_fields = ('user__username', 'title', 'content')
    readonly_fields = ('created_at', 'updated_at')

# Customize the admin site
admin.site.site_header = 'Learn English Admin'
admin.site.site_title = 'Learn English Platform'
admin.site.index_title = 'Welcome to Learn English Admin Dashboard'
