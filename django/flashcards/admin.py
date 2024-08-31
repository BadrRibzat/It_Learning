from django.contrib import admin
from .models import Flashcard, FlashcardCategory

class FlashcardInline(admin.TabularInline):
    model = Flashcard

@admin.register(FlashcardCategory)
class FlashcardCategoryAdmin(admin.ModelAdmin):
    inlines = [FlashcardInline]
    list_display = ('name',)

