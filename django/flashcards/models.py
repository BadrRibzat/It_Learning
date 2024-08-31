from django.db import models
from lessons.models import Lesson

class FlashcardCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Flashcard(models.Model):
    LEVEL_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    word = models.CharField(max_length=100)
    question = models.TextField()
    correct_answer = models.CharField(max_length=100)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='flashcards')
    category = models.ForeignKey(FlashcardCategory, on_delete=models.CASCADE, related_name='flashcards')

    def __str__(self):
        return self.word

