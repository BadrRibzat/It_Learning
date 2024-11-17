from django.db import models
from django.utils import timezone
from datetime import timedelta
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
        if self.level_order == 1:
            return True
        previous_level = Level.objects.filter(level_order=self.level_order - 1).first()
        if previous_level:
            return UserLevelTestProgress.objects.filter(
                user=user,
                level_test__level=previous_level,
                is_passed=True
            ).exists()
        return False

    class Meta:
        verbose_name = 'Level'
        verbose_name_plural = 'Levels'

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
        if not user.level:
            return self.level.difficulty == 'beginner'

        if self.level != user.level:
            return False

        if self.level.difficulty in ['intermediate', 'advanced']:
            previous_level = Level.objects.filter(level_order=self.level.level_order - 1).first()

            if previous_level:
                level_test_progress = UserLevelTestProgress.objects.filter(
                    user=user,
                    level_test__level=previous_level,
                    is_passed=True
                ).first()

                if not (level_test_progress and level_test_progress.score >= 80):
                    return False

        return True

    def unlock_next_lesson(self, user):
        """Unlock the next lesson in order after this one is completed."""
        next_lesson = Lesson.objects.filter(
            level=self.level,
            id__gt=self.id
        ).order_by('id').first()

        if next_lesson:
            user_progress = UserProgress.objects.create(
                user=user,
                lesson=next_lesson,
                is_unlocked=True
            )
            return user_progress
        return None

    class Meta:
        verbose_name = 'Lesson'
        verbose_name_plural = 'Lessons'

class Flashcard(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='flashcards')
    word = models.CharField(max_length=255)
    definition = models.TextField()
    example = models.TextField(null=True, blank=True)
    translation = models.CharField(max_length=255, blank=True, null=True)
    
    # Modify existing fields
    fill_in_blank_template = models.TextField(null=True, blank=True)
    blank_position = models.CharField(max_length=10, choices=[
        ('start', 'Start of Sentence'),
        ('middle', 'Middle of Sentence'),
        ('end', 'End of Sentence')
    ], default='middle')

    order = models.IntegerField(default=0, null=True, blank=True)
    is_last_card = models.BooleanField(default=False)
    difficulty_score = models.FloatField(default=1.0)
    hint_percentage = models.FloatField(default=0.3)

    # Add these fields to match the population script
    question = models.TextField(null=True, blank=True)
    blank_placeholder = models.CharField(max_length=50, default='______')

    def generate_fill_in_blank(self):
        """
        Generate a fill-in-the-blank template dynamically
        """
        if not self.example:
            return None

        # Choose a smart strategy for creating fill-in-blank
        words = self.example.split()
        if len(words) < 3:
            return self.example.replace(self.word, self.blank_placeholder)

        # Randomize blank position
        try:
            blank_index = words.index(self.word) if self.word in words else len(words) // 2
            words[blank_index] = self.blank_placeholder
            return ' '.join(words)
        except Exception:
            # Fallback if word not found
            return self.example.replace(self.word, self.blank_placeholder)

    def save(self, *args, **kwargs):
        # Ensure fill_in_blank_template is populated
        if not self.fill_in_blank_template and self.example:
            self.fill_in_blank_template = self.generate_fill_in_blank()
        
        # Populate question if not set
        if not self.question:
            self.question = f"Fill in the blank: {self.fill_in_blank_template}"
        
        super().save(*args, **kwargs)

    def __str__(self):
        return self.word

    class Meta:
        ordering = ['order']
        verbose_name = 'Flashcard'
        verbose_name_plural = 'Flashcards'

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

    class Meta:
        verbose_name = 'Quiz'
        verbose_name_plural = 'Quizzes'

class QuizQuestion(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    correct_answer = models.CharField(max_length=255)
    order = models.IntegerField(default=0, null=True, blank=True)

    blank_placeholder = models.CharField(max_length=50, default='______')


    class Meta:
        ordering = ['order']
        verbose_name = 'Quiz Question'
        verbose_name_plural = 'Quiz Questions'

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

    class Meta:
        verbose_name = 'Level Test'
        verbose_name_plural = 'Level Tests'

class LevelTestQuestion(models.Model):
    level_test = models.ForeignKey(LevelTest, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    correct_answer = models.CharField(max_length=255)
    order = models.IntegerField(default=0, null=True, blank=True)

    blank_placeholder = models.CharField(max_length=50, default='______')

    class Meta:
        ordering = ['order']
        verbose_name = 'Level Test Question'
        verbose_name_plural = 'Level Test Questions'

    def __str__(self):
        return self.question_text

class UserProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    score = models.PositiveIntegerField(default=0)
    total_questions = models.PositiveIntegerField(default=0)
    correct_answers = models.PositiveIntegerField(default=0)
    is_passed = models.BooleanField(default=False)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    time_spent = models.IntegerField(default=0)

    def start_lesson(self):
        """Mark the start of a lesson"""
        if not self.started_at:
            self.started_at = timezone.now()
            self.save()

    def complete_lesson(self, time_spent=None):
        """Complete the lesson and record time spent"""
        self.completed = True
        self.completed_at = timezone.now()

        if time_spent:
            self.time_spent = time_spent
        elif self.started_at:
            self.time_spent = timezone.now() - self.started_at

        self.save()

    @classmethod
    def get_learning_streak(cls, user):
        """
        Calculate user's learning streak
        A streak is consecutive days with learning activity
        """
        thirty_days_ago = timezone.now() - timedelta(days=30)

        completed_lessons = cls.objects.filter(
            user=user,
            completed=True,
            completed_at__gte=thirty_days_ago
        ).order_by('-completed_at')

        if not completed_lessons.exists():
            return 0

        streak = 0
        current_date = completed_lessons.first().completed_at.date()

        for progress in completed_lessons:
            lesson_date = progress.completed_at.date()

            if streak == 0 or (current_date - lesson_date).days <= 1:
                streak += 1
                current_date = lesson_date
            else:
                break

        return streak

    @classmethod
    def get_total_learning_time(cls, user, days=30):
        """
        Calculate total learning time for a user

        :param user: User instance
        :param days: Number of days to look back
        :return: Total learning time in seconds
        """
        time_lookback = timezone.now() - timedelta(days=days)

        total_time = cls.objects.filter(
            user=user,
            completed=True,
            completed_at__gte=time_lookback
        ).aggregate(
            total_duration=models.Sum('time_spent')
        )['total_duration'] or timedelta()

        return {
            'total_seconds': total_time.total_seconds(),
            'total_minutes': total_time.total_seconds() / 60,
            'total_hours': total_time.total_seconds() / 3600
        }

    def save(self, *args, **kwargs):
        if self.time_spent and self.time_spent.total_seconds() < 0:
            self.time_spent = timedelta()
        
        super().save(*args, **kwargs)

    class Meta:
        unique_together = ['user', 'lesson']
        verbose_name = 'User Progress'
        verbose_name_plural = 'User Progresses'

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title}"

class UserFlashcardProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    flashcard = models.ForeignKey(Flashcard, on_delete=models.CASCADE)
    is_completed = models.BooleanField(default=False)
    attempts = models.PositiveIntegerField(default=0)
    last_attempt = models.DateTimeField(null=True, blank=True)
    points_earned = models.FloatField(default=0)
    time_spent = models.IntegerField(default=0)

    class Meta:
        unique_together = ['user', 'flashcard']
        verbose_name = 'User Flashcard Progress'
        verbose_name_plural = 'User Flashcard Progresses'

    def __str__(self):
        return f"{self.user.username} - {self.flashcard.word}"

class UserQuizAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    total_score = models.FloatField(default=0)
    is_passed = models.BooleanField(default=False)
    attempts = models.PositiveIntegerField(default=1)
    completed_at = models.DateTimeField(null=True, blank=True)
    time_spent = models.IntegerField(default=0)

    class Meta:
        unique_together = ['user', 'quiz']
        verbose_name = 'User Quiz Attempt'
        verbose_name_plural = 'User Quiz Attempts'

    def __str__(self):
        return f"{self.user.username} - {self.quiz.title}"

class UserQuizProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE)
    user_answer = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)
    attempted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'quiz', 'question']
        verbose_name = 'User Quiz Progress'
        verbose_name_plural = 'User Quiz Progresses'

    def __str__(self):
        return f"{self.user.username} - {self.quiz.title} - {self.question.question_text}"

class UserLevelTestProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    level_test = models.ForeignKey(LevelTest, on_delete=models.CASCADE)
    question = models.ForeignKey(LevelTestQuestion, on_delete=models.CASCADE)
    user_answer = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)
    attempted_at = models.DateTimeField(auto_now_add=True)
    time_spent = models.IntegerField(default=0)

    class Meta:
        unique_together = ['user', 'level_test', 'question']
        verbose_name = 'User Level Test Progress'
        verbose_name_plural = 'User Level Test Progresses'

    def __str__(self):
        return f"{self.user.username} - {self.level_test.title} - {self.question.question_text}"
