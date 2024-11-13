from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from lessons.models import UserProgress, Flashcard
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from .models import (
    User, 
    Note, 
    ProfilePicture, 
    EmailVerificationToken, 
    PasswordResetToken
)
from lessons.models import (
    UserProgress,
    Flashcard,
    UserFlashcardProgress,
    UserQuizAttempt
)

from .utils import send_verification_email, send_password_reset_email

User = get_user_model()

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
        fields = [
            'id',
            'username', 
            'email', 
            'password', 
            'password_confirmation', 
            'language',
            'date_of_birth'
        ]
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True}
        }

    def validate(self, attrs):
        # Password confirmation validation
        if attrs['password'] != attrs.pop('password_confirmation'):
            raise serializers.ValidationError({
                "password": _("Password fields didn't match.")
            })
        
        # Email uniqueness validation
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({
                "email": _("A user with this email already exists.")
            })
        
        # Username uniqueness validation
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({
                "username": _("A user with this username already exists.")
            })
        
        return attrs

    def create(self, validated_data):
        # Remove password confirmation before creating user
        validated_data.pop('password_confirmation', None)
        
        # Create user with provided data
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

        # Use the parent method to generate tokens
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
            verification = EmailVerificationToken.objects.get(
                token=token, 
                expires_at__gt=timezone.now()
            )
            return verification
        except EmailVerificationToken.DoesNotExist:
            raise serializers.ValidationError("Invalid or expired verification token")

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, email):
        try:
            user = User.objects.get(email=email)
            return user
        except User.DoesNotExist:
            raise serializers.ValidationError("No user found with this email")

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(
        write_only=True, 
        validators=[validate_password]
    )
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({
                "confirm_password": "Passwords do not match"
            })
        return data

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'username', 
            'email', 
            'bio', 
            'date_of_birth', 
            'language'
        ]
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

    class Meta:
        model = User
        fields = ['completed_lessons', 'total_points', 'level', 'correct_flashcards', 'total_flashcards']

    def get_completed_lessons(self, obj):
        return UserProgress.objects.filter(user=obj, completed=True).count()

    def get_correct_flashcards(self, obj):
        from lessons.models import UserFlashcardProgress
        return UserFlashcardProgress.objects.filter(user=obj, is_completed=True).count()

    def get_total_flashcards(self, obj):
        return Flashcard.objects.count()

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
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_note_type(self, value):
        # Ensure note_type is one of the allowed choices
        allowed_types = [choice[0] for choice in Note.NOTE_TYPES]
        if value not in allowed_types:
            raise serializers.ValidationError(f"Note type must be one of {allowed_types}")
        return value

    def validate(self, data):
        # Additional custom validations
        if len(data.get('title', '')) < 3:
            raise serializers.ValidationError({"title": "Title must be at least 3 characters long"})
        if len(data.get('content', '')) < 10:
            raise serializers.ValidationError({"content": "Content must be at least 10 characters long"})
        return data

    def create(self, validated_data):
        
        user = self.context['request'].user
        note = Note.objects.create(user=user, **validated_data)
        return note
