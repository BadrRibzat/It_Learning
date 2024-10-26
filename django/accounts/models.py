from django.contrib.auth.models import AbstractUser
from django.db import models
from django.urls import reverse
from django.utils import timezone

class User(AbstractUser):
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    points = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    language = models.CharField(max_length=50, default='en')
    current_lesson = models.ForeignKey('lessons.Lesson', on_delete=models.SET_NULL, null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username

    def reset_progress(self):
        self.points = 0
        self.level = 1
        self.current_lesson = None
        self.save()
        if hasattr(self, 'progress'):
            self.progress.all().delete()
        if hasattr(self, 'quiz_attempts'):
            self.quiz_attempts.all().delete()
        if hasattr(self, 'flashcard_progress'):
            self.flashcard_progress.all().delete()
        if hasattr(self, 'level_progress'):
            self.level_progress.all().delete()

    def get_recommended_lessons(self):
        from lessons.models import Lesson, Level
        completed_lessons = self.progress.filter(completed=True).values_list('lesson_id', flat=True)
        next_level = Level.objects.filter(level_order=self.level + 1).first()
        if next_level:
            recommended_lessons = Lesson.objects.filter(level=next_level).exclude(id__in=completed_lessons)
        else:
            recommended_lessons = Lesson.objects.exclude(id__in=completed_lessons)
        return recommended_lessons

    def award_badge(self, badge):
        UserBadge.objects.create(user=self, badge=badge)

    def award_points(self, points):
        self.points += points
        self.save()

    def pass_level_test(self, level_test, score):
        if score >= 80:
            self.level += 1
            self.save()
            self.award_points(100)
            badge = Badge.objects.get(name="Level Up")
            self.award_badge(badge)
            return True
        return False

class Badge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

class UserBadge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    date_earned = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} earned {self.badge.name}"

class ProfilePicture(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='profile_pictures/')

    def __str__(self):
        return f"{self.user.username}'s Profile Picture"

class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    note_type = models.CharField(max_length=50, default='general')

    def __str__(self):
        return f"{self.user.username}'s Note"
