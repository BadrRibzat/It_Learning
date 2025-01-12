from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

class Level(models.Model):
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced')
    ]

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    difficulty = models.CharField(max_length=50, choices=DIFFICULTY_CHOICES, default='beginner')
    points_to_advance = models.IntegerField(default=0)
    position = models.IntegerField(unique=True)
    passing_score = models.IntegerField(default=80)
    unlocked_by_test = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Lesson(models.Model):
    title = models.CharField(max_length=200)
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name='lessons')
    position = models.IntegerField()
    description = models.TextField(blank=True)

    class Meta:
        unique_together = ('level', 'position')
        ordering = ['level', 'position']

    def __str__(self):
        return f"{self.level.name} - {self.title}"

class Flashcard(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='flashcards')
    word = models.CharField(max_length=100)
    definition = models.TextField()
    example = models.TextField()
    translation = models.CharField(max_length=100, blank=True)
    fill_in_blank_template = models.TextField(
        help_text="Template with _____ for fill-in-blank exercises",
        default="",
        blank=True
    )
    position = models.IntegerField()
    is_last_card = models.BooleanField(default=False)
    blank_placeholder = models.CharField(
        max_length=50,
        default="_____",
        help_text="Placeholder for fill-in-blank answers"
    )

    class Meta:
        unique_together = ('lesson', 'position')
        ordering = ['lesson', 'position']

    def __str__(self):
        return f"{self.lesson.title} - {self.word}"

class Quiz(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='quizzes')
    title = models.CharField(max_length=200)
    passing_score = models.IntegerField(default=80)
    total_questions = models.IntegerField()

    def __str__(self):
        return f"Quiz for {self.lesson.title}"

class QuizQuestion(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    correct_answer = models.CharField(max_length=200)
    position = models.IntegerField()
    fill_in_blank_template = models.TextField(
        help_text="Template with _____ for fill-in-blank exercises",
        default="",
        blank=True
    )
    blank_placeholder = models.CharField(
        max_length=50,
        default="_____",
        help_text="Placeholder for fill-in-blank answers"
    )

    class Meta:
        unique_together = ('quiz', 'position')
        ordering = ['quiz', 'position']

class LevelTest(models.Model):
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name='tests')
    generated_from_level = models.ForeignKey(Level, on_delete=models.SET_NULL, null=True, related_name='generated_tests')
    passing_score = models.IntegerField(default=80)
    total_questions = models.IntegerField()

    def __str__(self):
        return f"{self.level.name} Level Test"

class LevelTestQuestion(models.Model):
    level_test = models.ForeignKey(LevelTest, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    correct_answer = models.CharField(max_length=200)
    position = models.IntegerField()
    fill_in_blank_template = models.TextField(
        help_text="Template with _____ for fill-in-blank exercises",
        default="",
        blank=True
    )
    blank_placeholder = models.CharField(
        max_length=50,
        default="_____",
        help_text="Placeholder for fill-in-blank answers"
    )

    class Meta:
        unique_together = ('level_test', 'position')
        ordering = ['level_test', 'position']

class UserProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='progress')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    level = models.ForeignKey(Level, on_delete=models.CASCADE)
    completed_flashcards = models.IntegerField(default=0)
    quiz_score = models.FloatField(default=0)
    quiz_completed = models.BooleanField(default=False)
    level_test_score = models.FloatField(default=0)
    level_unlocked = models.BooleanField(default=False)
    last_updated = models.DateTimeField(auto_now=True)
    
    time_spent = models.IntegerField(default=0)

    class Meta:
        unique_together = ('user', 'lesson', 'level')

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title}"

class UserFlashcardProgress(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='flashcard_progress')
    flashcard = models.ForeignKey(Flashcard, on_delete=models.CASCADE)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'flashcard')

    def __str__(self):
        return f"{self.user.username} - {self.flashcard.word}"

class UserQuizAttempt(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='quiz_attempts')
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.FloatField(default=0)
    is_passed = models.BooleanField(default=False)
    attempted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'quiz')

    def __str__(self):
        return f"{self.user.username} - {self.quiz.title}"
