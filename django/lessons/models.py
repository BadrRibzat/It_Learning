from django.db import models
from accounts.models import User

class Level(models.Model):
    name = models.CharField(max_length=255)
    level_order = models.PositiveIntegerField(unique=True)

    def __str__(self):
        return self.name

class Lesson(models.Model):
    title = models.CharField(max_length=255)
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name='lessons')
    content = models.TextField()
    difficulty = models.CharField(max_length=50, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced')
    ])
    is_unlocked = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class Flashcard(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='flashcards')
    word = models.CharField(max_length=255)
    definition = models.TextField()
    example = models.TextField(null=True, blank=True)
    translation = models.CharField(max_length=255, blank=True, null=True)
    question = models.TextField(default='No question provided')

    def __str__(self):
        return self.word

class Quiz(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='quizzes')
    title = models.CharField(max_length=255)
    passing_score = models.PositiveIntegerField(default=80)

    def __str__(self):
        return self.title

class QuizQuestion(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    correct_answer = models.CharField(max_length=255)
    options = models.JSONField(default=list)

    def __str__(self):
        return self.question_text

class LevelTest(models.Model):
    level = models.ForeignKey(Level, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    passing_score = models.PositiveIntegerField(default=80)

    def __str__(self):
        return f"{self.level.name} Level Test"

class LevelTestQuestion(models.Model):
    level_test = models.ForeignKey(LevelTest, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    correct_answer = models.CharField(max_length=255)
    options = models.JSONField(default=list)

    def __str__(self):
        return self.question_text

class UserProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    score = models.PositiveIntegerField(default=0)
    total_questions = models.PositiveIntegerField(default=0)
    correct_answers = models.PositiveIntegerField(default=0)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ['user', 'lesson']

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title}"

class UserLevelProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    level = models.ForeignKey(Level, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    score = models.PositiveIntegerField(default=0)
    total_questions = models.PositiveIntegerField(default=0)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ['user', 'level']

    def __str__(self):
        return f"{self.user.username} - {self.level.name}"
