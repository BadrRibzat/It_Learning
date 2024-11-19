from django.apps import apps
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from lessons.models import UserProgress, Flashcard, UserFlashcardProgress, UserQuizAttempt
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils.translation import gettext_lazy as _
from .models import (
    User,
    Note,
    ProfilePicture,
    EmailVerificationToken,
    PasswordResetToken,
    MultiFactorAuthentication
)

User = apps.get_model('accounts', 'User')

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirmation = serializers.CharField(
        write_only=True, 
        required=True, 
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'password_confirmation', 'language', 'date_of_birth']
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True}
        }

    def validate(self, attrs):
        if 'password_confirmation' not in attrs:
            raise serializers.ValidationError({"password_confirmation": "This field is required."})

        if attrs['password'] != attrs['password_confirmation']:
            raise serializers.ValidationError({"password": "Passwords do not match."})

        attrs.pop('password_confirmation', None)

        if not attrs.get('username'):
            raise serializers.ValidationError({"username": "Username is required"})

        if not attrs.get('email'):
            raise serializers.ValidationError({"email": "Email is required"})

        if not attrs.get('password'):
            raise serializers.ValidationError({"password": "Password is required"})

        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})

        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "A user with this username already exists."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            language=validated_data.get('language', 'en'),
            date_of_birth=validated_data.get('date_of_birth')
        )
        return user

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'username': instance.username,
            'email': instance.email,
            'language': instance.language
        }

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        try:
            user = User.objects.get(email=attrs.get('email'))
            if not user.check_password(attrs.get('password')):
                raise serializers.ValidationError('Invalid credentials')
        except User.DoesNotExist:
            raise serializers.ValidationError('No user found with this email')

        refresh = self.get_token(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        return token

class MultiFactorAuthSerializer(serializers.ModelSerializer):
    token = serializers.CharField(write_only=True, required=False)
    provisioning_uri = serializers.SerializerMethodField()

    class Meta:
        model = MultiFactorAuthentication
        fields = ['is_enabled', 'token', 'provisioning_uri']

    def get_provisioning_uri(self, obj):
        return obj.get_provisioning_uri()

    def create(self, validated_data):
        user = self.context['request'].user

        mfa, created = MultiFactorAuthentication.objects.get_or_create(user=user)

        if created or not mfa.secret_key:
            mfa.generate_secret()

        return mfa

    def validate(self, data):
        if 'token' in data:
            mfa = MultiFactorAuthentication.objects.get(user=self.context['request'].user)
            if not mfa.verify_token(data['token']):
                raise serializers.ValidationError("Invalid token")

        mfa.is_enabled = True
        mfa.save()

        return data

class UserProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'bio', 'profile_picture']
        read_only_fields = ['id', 'email']

    def get_profile_picture(self, obj):
        if hasattr(obj, 'profilepicture'):
            return obj.profilepicture.image.url
        return None

class EmailVerificationSerializer(serializers.Serializer):
    token = serializers.UUIDField()

    def validate_token(self, token):
        try:
            verification = EmailVerificationToken.objects.get(token=token, expires_at__gt=timezone.now())
            return verification
        except EmailVerificationToken.DoesNotExist:
            raise serializers.ValidationError("Invalid or expired verification token")

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, email):
        return email

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
        return data

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'bio', 'date_of_birth', 'language']
        read_only_fields = ['email']

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.bio = validated_data.get('bio', instance.bio)
        instance.date_of_birth = validated_data.get('date_of_birth', instance.date_of_birth)
        instance.language = validated_data.get('language', instance.language)
        instance.save()
        return instance

class UserStatisticsSerializer(serializers.ModelSerializer):
    completed_lessons = serializers.SerializerMethodField()
    total_points = serializers.IntegerField(source='points')
    correct_flashcards = serializers.SerializerMethodField()
    total_flashcards = serializers.SerializerMethodField()
    learning_streak = serializers.SerializerMethodField()
    time_spent_learning = serializers.SerializerMethodField()
    current_level_progress = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'completed_lessons', 'total_points', 'level',
            'correct_flashcards', 'total_flashcards',
            'learning_streak', 'time_spent_learning',
            'current_level_progress'
        ]

    def get_completed_lessons(self, obj):
        return UserProgress.objects.filter(user=obj, completed=True).count()

    def get_correct_flashcards(self, obj):
        return UserFlashcardProgress.objects.filter(user=obj, is_completed=True).count()

    def get_total_flashcards(self, obj):
        return Flashcard.objects.count()

    def get_learning_streak(self, obj):
        from django.utils import timezone
        from datetime import timedelta

        daily_progress = UserProgress.objects.filter(
            user=obj,
            completed_at__gte=timezone.now() - timedelta(days=30)
        ).order_by('-completed_at')

        streak = 0
        last_day = None
        for progress in daily_progress:
            if last_day is None or (last_day - progress.completed_at.date()).days == 1:
                streak += 1
                last_day = progress.completed_at.date()
            else:
                break

        return streak

    def get_time_spent_learning(self, obj):
        from django.db.models import Sum
        from datetime import timedelta

        total_seconds = UserProgress.objects.filter(user=obj).aggregate(
            total_time=Sum('time_spent')
        )['total_time'] or 0

        return {
            'total_hours': total_seconds / 3600,
            'total_minutes': total_seconds / 60
        }

    def get_current_level_progress(self, obj):
        current_level = obj.level
        if not current_level:
            return None

        total_lessons = Lesson.objects.filter(level=current_level).count()
        completed_lessons = UserProgress.objects.filter(
            user=obj,
            lesson__level=current_level,
            completed=True
        ).count()

        total_quizzes = Quiz.objects.filter(lesson__level=current_level).count()
        passed_quizzes = UserQuizAttempt.objects.filter(
            user=obj,
            quiz__lesson__level=current_level,
            is_passed=True
        ).count()

        return {
            'level_name': current_level.name,
            'lessons_progress': {
                'completed': completed_lessons,
                'total': total_lessons,
                'percentage': (completed_lessons / total_lessons * 100) if total_lessons > 0 else 0
            },
            'quizzes_progress': {
                'passed': passed_quizzes,
                'total': total_quizzes,
                'percentage': (passed_quizzes / total_quizzes * 100) if total_quizzes > 0 else 0
            }
        }

class UserProgressSerializer(serializers.ModelSerializer):
    completed_lessons = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'level', 'points', 'completed_lessons']

    def get_completed_lessons(self, obj):
        return UserProgress.objects.filter(user=obj, completed=True).count()

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'note_type', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'user']

    def validate_note_type(self, value):
        valid_types = [choice[0] for choice in Note.NOTE_TYPES]
        if value not in valid_types:
            raise serializers.ValidationError(f"Invalid note type. Choose from {valid_types}")
        return value

    def validate(self, data):
        if len(data.get('title', '')) < 3:
            raise serializers.ValidationError({"title": "Title must be at least 3 characters long"})
        if len(data.get('content', '')) < 10:
            raise serializers.ValidationError({"content": "Content must be at least 10 characters long"})
        return data

    def create(self, validated_data):
        user = self.context['request'].user
        note = Note.objects.create(user=user, **validated_data)
        return note
