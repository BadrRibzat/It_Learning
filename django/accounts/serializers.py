from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, Note
from lessons.models import UserProgress, Flashcard
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

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

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirmation = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirmation')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirmation']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirmation')
        user = User.objects.create_user(**validated_data)
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
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
        return UserFlashcardProgress.objects.filter(user=obj, completed=True).count()

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
        fields = ['id', 'user', 'content', 'created_at', 'note_type']
        read_only_fields = ['id', 'created_at', 'user']
