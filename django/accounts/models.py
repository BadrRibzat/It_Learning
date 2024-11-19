from django.contrib.auth.models import AbstractUser, UnicodeUsernameValidator
from django.db import models
from django.core.validators import MaxLengthValidator, MinLengthValidator
from django.utils.translation import gettext_lazy as _
import uuid
from django.utils import timezone
from datetime import timedelta
import pyotp
from django.conf import settings

LANGUAGE_CHOICES = [
    ('en', _('English')),
    ('ar', _('Arabic')),
    ('fr', _('French')),
    ('es', _('Spanish')),
    ('de', _('German')),
]

class MultiFactorAuthentication(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    secret_key = models.CharField(max_length=32, unique=True)
    is_enabled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def generate_secret(self):
        self.secret_key = pyotp.random_base32()
        self.save()
        return self.secret_key

    def verify_token(self, token):
        totp = pyotp.TOTP(self.secret_key)
        return totp.verify(token)

    def get_provisioning_uri(self, username=None):
        totp = pyotp.TOTP(self.secret_key)
        return totp.provisioning_uri(name=username or self.user.email, issuer_name='LearnEnglishPlatform')

class User(AbstractUser):
    username_validator = UnicodeUsernameValidator()

    username = models.CharField(
        _('username'),
        max_length=150,
        unique=True,
        help_text=_('Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.'),
        validators=[username_validator],
        error_messages={
            'unique': _("A user with that username already exists."),
        },
    )

    email = models.EmailField(
        _('email address'),
        unique=True,
        error_messages={
            'unique': _("A user with this email already exists."),
        }
    )

    bio = models.TextField(
        _('bio'),
        blank=True,
        null=True,
        max_length=500,
        validators=[
            MaxLengthValidator(500, message=_("Bio cannot exceed 500 characters")),
        ]
    )

    date_of_birth = models.DateField(_('date of birth'), null=True, blank=True)

    language = models.CharField(_('language'), max_length=10, choices=LANGUAGE_CHOICES, default='en')

    points = models.PositiveIntegerField(default=0)
    level = models.ForeignKey('lessons.Level', on_delete=models.SET_NULL, null=True, default=None)

    is_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def calculate_language_proficiency(self):
        total_lessons = Lesson.objects.count()
        completed_lessons = UserProgress.objects.filter(user=self, completed=True).count()
        quiz_performance = UserQuizAttempt.objects.filter(user=self, is_passed=True).aggregate(avg_score=models.Avg('total_score'))['avg_score'] or 0
        flashcard_performance = UserFlashcardProgress.objects.filter(user=self, is_completed=True).count() / Flashcard.objects.count()

        proficiency = (
            0.4 * (completed_lessons / total_lessons) +
            0.3 * (quiz_performance / 100) +
            0.3 * flashcard_performance
        )

        return min(1.0, max(0.1, proficiency))

    def __str__(self):
        return f"{self.username} - Level {self.level}"

    def update_points(self, points):
        self.points += points
        self.save()

    def update_level(self, new_level):
        self.level = new_level
        self.save()

    def reset_progress(self):
        from django.apps import apps
        from lessons.models import Level

        UserProgress = apps.get_model('lessons', 'UserProgress')
        UserQuizAttempt = apps.get_model('lessons', 'UserQuizAttempt')
        UserFlashcardProgress = apps.get_model('lessons', 'UserFlashcardProgress')
        try:
            beginner_level = Level.objects.get(name='Beginner', difficulty='beginner')
        except Level.DoesNotExist:
            beginner_level, _ = Level.objects.get_or_create(
                name='Beginner',
                defaults={
                    'level_order': 1,
                    'points_to_advance': 100,
                    'difficulty': 'beginner',
                    'unlocked_by_test': False
                }
            )

        UserProgress.objects.filter(user=self).delete()
        UserQuizAttempt.objects.filter(user=self).delete()
        UserFlashcardProgress.objects.filter(user=self).delete()
        self.points = 0
        self.level = beginner_level
        self.save()

    def get_reset_progress_details(self):
        """
        Provides detailed information about the user's reset progress
        """
        return {
            "user_id": self.id,
            "username": self.username,
            "reset_level": {
                "id": self.level.id,
                "name": self.level.name,
                "difficulty": self.level.difficulty
            },
            "reset_points": self.points,
            "reset_timestamp": timezone.now()
        }

    def get_recommended_lessons(self):
        from lessons.models import Lesson, Level, UserProgress
        completed_lessons = UserProgress.objects.filter(user=self, completed=True).values_list('lesson_id', flat=True)
        current_level = Level.objects.get(level_order=self.level)
        recommended_lessons = Lesson.objects.filter(level=current_level).exclude(id__in=completed_lessons)
        return recommended_lessons

    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        ordering = ['-date_joined']

    def can_access_level(self, level):
        """
        Check if user can access a specific level based on level test progress
        """
        if level.level_order == 1:
            return True

        previous_level = Level.objects.filter(level_order=level.level_order - 1).first()

        if previous_level:
            level_test_progress = UserLevelTestProgress.objects.filter(
                user=self,
                level_test__level=previous_level,
                is_passed=True,
                score__gte=80
            ).exists()

            return level_test_progress

        return False

    def calculate_level_progress(self):
        from django.apps import apps

        Level = apps.get_model('lessons', 'Level')
        UserFlashcardProgress = apps.get_model('lessons', 'UserFlashcardProgress')
        UserQuizAttempt = apps.get_model('lessons', 'UserQuizAttempt')

        try:
            current_level = Level.objects.get(level_order=self.level)
        except Level.DoesNotExist:
            current_level = Level.objects.first()

        flashcard_points = UserFlashcardProgress.objects.filter(user=self, is_completed=True).aggregate(total_points=models.Sum('points_earned'))['total_points'] or 0
        quiz_points = UserQuizAttempt.objects.filter(user=self, is_passed=True).aggregate(total_points=models.Sum('total_score'))['total_points'] or 0
        total_points = flashcard_points + quiz_points

        return {
            'current_level': current_level.name,
            'total_points': total_points,
            'progress_percentage': (total_points / (current_level.points_to_advance or 1)) * 100
        }

    def can_take_level_test(self):
        return self.calculate_level_progress()['progress_percentage'] >= 80

class EmailVerificationToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=timezone.now)

    def is_valid(self):
        return timezone.now() <= self.expires_at

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(hours=24)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Verification token for {self.user.email}"

class PasswordResetToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=False, blank=False)

    def generate_token(self):
        self.token = str(uuid.uuid4())
        self.expires_at = timezone.now() + timedelta(hours=1)
        self.save()

    def is_valid(self):
        return timezone.now() <= self.expires_at

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(hours=1)
        super().save(*args, **kwargs)

class ProfilePicture(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='profile_pictures/')

    def __str__(self):
        return f"{self.user.username}'s Profile Picture"

class Note(models.Model):
    NOTE_TYPES = [
        ('general', 'General'),
        ('vocabulary', 'Vocabulary'),
        ('grammar', 'Grammar')
        ]

    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='notes')
    title = models.CharField(
        max_length=100,
        validators=[
            MinLengthValidator(3, message="Title must be at least 3 characters long"),
            MaxLengthValidator(100, message="Title cannot exceed 100 characters")
        ]
    )
    content = models.TextField(
        validators=[
            MinLengthValidator(10, message="Content must be at least 10 characters long"),
            MaxLengthValidator(1000, message="Content cannot exceed 1000 characters")
        ]
    )
    note_type = models.CharField(
        max_length=50,
        choices=NOTE_TYPES,
        default='general'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Note: {self.title}"

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Note'
        verbose_name_plural = 'Notes'
