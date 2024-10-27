from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User
from .serializers import UserSerializer, UserRegistrationSerializer

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            user = User.objects.get(email=request.data['email'])
            user_data = UserSerializer(user).data
            response.data['user'] = user_data
        return response

from rest_framework import status, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, CustomTokenObtainPairSerializer
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.db.models import Avg
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.html import strip_tags
from django.utils.encoding import force_bytes
from django.conf import settings
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import TokenError, BlacklistedToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth.tokens import default_token_generator
from django.template.loader import render_to_string
from accounts.models import User, Note, ProfilePicture
from accounts.serializers import UserSerializer, UserProfileSerializer, NoteSerializer
from lessons.models import UserProgress, UserQuizAttempt, Lesson, Flashcard, UserFlashcardProgress, UserLevelProgress
from lessons.serializers import LessonSerializer
import os
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from email.mime.text import MIMEText
import base64
import logging

User = get_user_model()

logger = logging.getLogger(__name__)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logger.debug("RegisterView.post called")
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            logger.debug("Serializer is valid")
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        logger.debug(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = User.objects.filter(email=email).first()
        if user is None or not user.check_password(password):
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data,
        }, status=status.HTTP_200_OK)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token is None:
                return Response({'detail': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({'detail': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UploadProfilePictureView(APIView):
    """
    Upload user profile picture.
    """
    permission_classes = [permissions.IsAuthenticated]  # Remove IsOwnerOrReadOnly if not defined
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        if 'profile_picture' not in request.FILES:
            return Response({"detail": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        image = request.FILES['profile_picture']

        profile_pictures_dir = 'profile_pictures'
        if not os.path.exists(profile_pictures_dir):
            os.makedirs(profile_pictures_dir)

        image_path = os.path.join(profile_pictures_dir, f'{user.id}_{image.name}')
        with open(image_path, 'wb+') as destination:
            for chunk in image.chunks():
                destination.write(chunk)

        ProfilePicture.objects.create(user=user, image=image)

        return Response({"detail": "Profile picture uploaded successfully"}, status=status.HTTP_200_OK)

class ResetProgressView(APIView):
    """
    Reset user progress.
    """
    permission_classes = [permissions.IsAuthenticated]  # Remove IsOwnerOrReadOnly if not defined

    def post(self, request):
        user = request.user
        if not user.id:
            return Response({"detail": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

        UserProgress.objects.filter(user=user).delete()
        UserQuizAttempt.objects.filter(user=user).delete()

        user.points = 0
        user.level = 1
        user.save()
        return Response({"detail": "Progress reset successfully"}, status=status.HTTP_200_OK)

class NoteViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for user notes.
    """
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]  # Remove IsOwnerOrReadOnly if not defined

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            # Swagger schema generation
            return Note.objects.none()
        return Note.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_current_lesson(request):
    lesson_id = request.data.get('lesson_id')
    if lesson_id:
        try:
            lesson = Lesson.objects.get(id=lesson_id)
            request.user.current_lesson = lesson
            request.user.save()
            return Response({'status': 'success'}, status=status.HTTP_200_OK)
        except Lesson.DoesNotExist:
            return Response({'error': 'Lesson not found'}, status=status.HTTP_404_NOT_FOUND)
    return Response({'error': 'Lesson ID is required'}, status=status.HTTP_400_BAD_REQUEST)

class RecommendedLessonsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        recommended_lessons = user.get_recommended_lessons()
        serializer = LessonSerializer(recommended_lessons, many=True)
        return Response(serializer.data)

class PasswordResetConfirmView(APIView):
    """
    Confirm password reset.
    """
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            new_password = request.data.get('new_password')
            if new_password:
                user.set_password(new_password)
                user.save()
                return Response({"detail": "Password reset successful"}, status=status.HTTP_200_OK)
            return Response({"detail": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetView(APIView):
    """
    Send a password reset email.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if email:
            user = User.objects.filter(email=email).first()
            if user:
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                reset_url = f"{settings.FRONTEND_URL}/password-reset-confirm/{uid}/{token}/"

                # Render the email template
                html_message = render_to_string('password_reset_email.html', {
                    'user': user,
                    'reset_url': reset_url,
                })
                plain_message = strip_tags(html_message)

                # Send email using Django's send_mail function
                send_mail(
                    'Password Reset',
                    plain_message,
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    html_message=html_message,
                )

                return Response({"detail": "Password reset email sent"}, status=status.HTTP_200_OK)
        return Response({"detail": "Email not found"}, status=status.HTTP_400_BAD_REQUEST)

class UserStatisticsView(APIView):
    """
    Retrieve user statistics.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        completed_lessons = UserProgress.objects.filter(user=user, completed=True).count()
        total_lessons = Lesson.objects.count()
        correct_flashcards = UserFlashcardProgress.objects.filter(user=user, completed=True).count()
        total_flashcards = Flashcard.objects.count()

        return Response({
            'completed_lessons': completed_lessons,
            'total_lessons': total_lessons,
            'correct_flashcards': correct_flashcards,
            'total_flashcards': total_flashcards,
            'current_level': user.level
        })

class ProfileView(APIView):
    """
    Retrieve or update user profile.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def check_user(request):
    """
    Check if a user exists with the provided email and password.
    """
    email = request.data.get('email')
    password = request.data.get('password')
    user = User.objects.filter(email=email).first()
    if user:
        return Response({
            'user_exists': True,
            'is_active': user.is_active,
            'password_correct': user.check_password(password)
        })
    return Response({'user_exists': False})

