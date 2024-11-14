from django.db import models
from django.utils import timezone
from accounts.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models import Q, Sum

class Level(models.Model):
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced')
    ]

    name = models.CharField(max_length=255, unique=True)
    level_order = models.PositiveIntegerField(unique=True)
    points_to_advance = models.PositiveIntegerField(default=100)
    difficulty = models.CharField(max_length=50, choices=DIFFICULTY_CHOICES)
    unlocked_by_test = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name

    def can_user_access(self, user):
        """
        Determine if a user can access this level
        """
        if self.level_order == 1:  # Beginner level is always accessible
            return True
        
        # Check if user has passed previous level test
        previous_level = Level.objects.filter(level_order=self.level_order - 1).first()
        if previous_level:
            return UserLevelTestProgress.objects.filter(
                user=user, 
                level_test__level=previous_level,
                is_passed=True
            ).exists()
        
        return False

class Lesson(models.Model):
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced')
    ]

    title = models.CharField(max_length=255)
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name='lessons')
    content = models.TextField()
    difficulty = models.CharField(max_length=50, choices=DIFFICULTY_CHOICES)
    is_unlocked = models.BooleanField(default=False)
    points_to_complete = models.PositiveIntegerField(default=50)
    flashcard_count = models.PositiveIntegerField(default=5)
    
    def __str__(self):
        return self.title

    def can_user_access(self, user):
        """
        Determine if a user can access this lesson
        """
        # Check if the lesson's level is accessible
        if not self.level.can_user_access(user):
            return False
        
        # For intermediate and advanced levels, check previous lesson completion
        if self.level.difficulty in ['intermediate', 'advanced']:
            previous_lessons = Lesson.objects.filter(
                level=self.level, 
                id__lt=self.id
            ).order_by('id')
            
            for prev_lesson in previous_lessons:
                lesson_progress = UserProgress.objects.filter(
                    user=user, 
                    lesson=prev_lesson, 
                    completed=True
                )
                if not lesson_progress.exists():
                    return False
        
        return True

class Flashcard(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='flashcards')
    word = models.CharField(max_length=255)
    definition = models.TextField()
    example = models.TextField(null=True, blank=True)
    translation = models.CharField(max_length=255, blank=True, null=True)
    question = models.TextField(default='Fill in the blank')
    is_last_card = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.word

class Quiz(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='quizzes')
    title = models.CharField(max_length=255)
    passing_score = models.PositiveIntegerField(
        default=80, 
        validators=[MinValueValidator(50), MaxValueValidator(100)]
    )
    total_questions = models.PositiveIntegerField(default=5)

    def __str__(self):
        return self.title

class QuizQuestion(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    correct_answer = models.CharField(max_length=255)
    options = models.JSONField(default=list)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.question_text

class LevelTest(models.Model):
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name='tests')
    title = models.CharField(max_length=255)
    passing_score = models.PositiveIntegerField(
        default=80, 
        validators=[MinValueValidator(50), MaxValueValidator(100)]
    )
    total_questions = models.PositiveIntegerField(default=10)

    def __str__(self):
        return f"{self.level.name} Level Test"

class LevelTestQuestion(models.Model):
    level_test = models.ForeignKey(LevelTest, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    correct_answer = models.CharField(max_length=255)
    options = models.JSONField(default=list)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

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

class UserFlashcardProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    flashcard = models.ForeignKey(Flashcard, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    attempts = models.PositiveIntegerField(default=0)
    last_attempt = models.DateTimeField(null=True, blank=True)
    points_earned = models.FloatField(default=0)

    class Meta:
        unique_together = ['user', 'flashcard']

    def __str__(self):
        return f"{self.user.username} - {self.flashcard.word}"

class UserQuizAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    total_score = models.FloatField(default=0)
    is_passed = models.BooleanField(default=False)
    attempts = models.PositiveIntegerField(default=1)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ['user', 'quiz']

    def __str__(self):
        return f"{self.user.username} - {self.quiz.title}"

class UserLevelTestProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    level_test = models.ForeignKey(LevelTest, on_delete=models.CASCADE)
    is_passed = models.BooleanField(default=False)
    score = models.PositiveIntegerField(default=0)
    total_questions = models.PositiveIntegerField(default=0)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ['user', 'level_test']

    def __str__(self):
        return f"{self.user.username} - {self.level_test.level.name} Level Test"
