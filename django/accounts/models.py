from django.contrib.auth.models import AbstractUser, UnicodeUsernameValidator
from django.db import models
from django.core.validators import MaxLengthValidator, MinLengthValidator
from django.utils.translation import gettext_lazy as _
import uuid
from django.utils import timezone
from datetime import timedelta

# Define language choices
LANGUAGE_CHOICES = [
    ('en', _('English')),
    ('ar', _('Arabic')),
    ('fr', _('French')),
    ('es', _('Spanish')),
    ('de', _('German')),
]

class User(AbstractUser):
    # Custom username validator
    username_validator = UnicodeUsernameValidator()

    # Override username field to use custom validator
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

    # Email field with uniqueness constraint
    email = models.EmailField(
        _('email address'),
        unique=True,
        error_messages={
            'unique': _("A user with this email already exists."),
        }
    )

    # Enhanced profile fields
    bio = models.TextField(
        _('bio'),
        blank=True, 
        null=True, 
        max_length=500,
        validators=[
            MaxLengthValidator(500, message=_("Bio cannot exceed 500 characters")),
        ]
    )

    # Date of Birth
    date_of_birth = models.DateField(
        _('date of birth'),
        null=True, 
        blank=True
    )

    # Language preference
    language = models.CharField(
        _('language'),
        max_length=10, 
        choices=LANGUAGE_CHOICES, 
        default='en'
    )

    # Learning progress tracking
    points = models.PositiveIntegerField(default=0)
    level = models.PositiveIntegerField(default=1)
    
    # Account verification
    is_verified = models.BooleanField(default=False)

    # Social authentication fields
    google_id = models.CharField(max_length=255, blank=True, null=True)
    facebook_id = models.CharField(max_length=255, blank=True, null=True)

    # Set email as the unique identifier for authentication
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.username} - Level {self.level}"

    def update_points(self, points):
        """Update user's total points"""
        self.points += points
        self.save()

    def update_level(self, new_level):
        """Update user's current learning level"""
        self.level = new_level
        self.save()

    def reset_progress(self):
        """Reset user's learning progress"""
        from lessons.models import UserProgress, UserQuizAttempt
        UserProgress.objects.filter(user=self).delete()
        UserQuizAttempt.objects.filter(user=self).delete()
        self.points = 0
        self.level = 1
        self.save()

    def get_recommended_lessons(self):
        """Get recommended lessons based on user's current level"""
        from lessons.models import Lesson, Level, UserProgress
        completed_lessons = UserProgress.objects.filter(user=self, completed=True).values_list('lesson_id', flat=True)
        current_level = Level.objects.get(level_order=self.level)
        recommended_lessons = Lesson.objects.filter(level=current_level).exclude(id__in=completed_lessons)
        return recommended_lessons

    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        ordering = ['-date_joined']

class EmailVerificationToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=timezone.now)

    def is_valid(self):
        return timezone.now() <= self.expires_at

    def save(self, *args, **kwargs):
        # Set expiration to 24 hours from creation
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(hours=24)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Verification token for {self.user.email}"

class PasswordResetToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def generate_token(self):
        self.token = str(uuid.uuid4())
        self.expires_at = timezone.now() + timedelta(hours=1)

    def is_valid(self):
        return timezone.now() <= self.expires_at

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
