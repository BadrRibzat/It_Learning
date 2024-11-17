from django.apps import apps
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status, viewsets, permissions, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .utils import send_verification_email, send_password_reset_email

from django.contrib.auth import get_user_model
from django.utils.html import strip_tags
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.conf import settings
import uuid
import os

from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    UserProfileSerializer,
    UserStatisticsSerializer,
    NoteSerializer,
    CustomTokenObtainPairSerializer,
    EmailVerificationSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    MultiFactorAuthSerializer
)
from .models import (
    User,
    Note,
    ProfilePicture,
    EmailVerificationToken,
    PasswordResetToken,
    MultiFactorAuthentication
)
from lessons.models import (
    UserProgress,
    Lesson,
    UserFlashcardProgress,
    UserQuizAttempt
)
from lessons.serializers import (
    LessonSerializer,
    UserFlashcardProgressSerializer,
    UserQuizAttemptSerializer
)
from .permissions import IsOwnerOrReadOnly
from rest_framework.decorators import action
from django.db.models import Q

User = get_user_model()

class BaseAuthenticatedView(APIView):
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

class UserRegistrationView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        try:
            if serializer.is_valid(raise_exception=False):
                user = serializer.save()
                return Response({
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'language': user.language
                }, status=status.HTTP_201_CREATED)
            else:
                print("Validation Errors:", serializer.errors)
                return Response(
                    {'errors': serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            print(f"Registration Error: {e}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                print(f"Login attempt for {email}")
                refresh = RefreshToken.for_user(user)
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': UserSerializer(user).data
                })
            else:
                return Response(
                    {'error': 'Invalid credentials'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        except User.DoesNotExist:
            return Response(
                {'error': 'No user found with this email'},
                status=status.HTTP_404_NOT_FOUND
            )

class MultiFactorAuthView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            mfa, created = MultiFactorAuthentication.objects.get_or_create(user=user)
            
            if created or not mfa.secret_key:
                mfa.generate_secret()
                mfa.save()

            return Response({
                'message': 'Multi-factor authentication setup initiated',
                'provisioning_uri': mfa.get_provisioning_uri(),
                'is_enabled': mfa.is_enabled
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                return Response(
                    {"error": "Refresh token is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception as token_error:
                return Response(
                    {"error": "Invalid refresh token"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            return Response(
                {"detail": "Successfully logged out"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": "Logout failed"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class EmailVerificationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = EmailVerificationSerializer(data=request.data)

        if serializer.is_valid():
            verification = serializer.validated_data['token']
            user = verification.user

            if not verification.is_valid():
                verification.delete()
                new_token = EmailVerificationToken.objects.create(user=user)

                verification_link = f"{settings.FRONTEND_URL}/verify-email/{new_token.token}"
                self.send_verification_email(user, verification_link)

                return Response({
                    'detail': 'Verification token expired. A new verification link has been sent.',
                    'token_regenerated': True
                }, status=status.HTTP_400_BAD_REQUEST)

            user.is_verified = True
            user.save()
            verification.delete()

            return Response({
                'detail': 'Email verified successfully',
                'username': user.username
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def send_verification_email(user, verification_link):
        subject = 'Verify Your Email - Learn English Platform'
        html_message = render_to_string('emails/verification.html', {
            'username': user.username,
            'verification_link': verification_link,
            'platform_name': 'Learn English Platform'
        })
        plain_message = strip_tags(html_message)

        try:
            send_mail(
                subject,
                plain_message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                html_message=html_message,
                fail_silently=False,
            )
            log_info(f"Verification email sent to {user.email}")
        except Exception as e:
            log_error(f"Failed to send verification email: {e}")

class ResendVerificationEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        EmailVerificationToken.objects.filter(user=user).delete()

        verification_token = EmailVerificationToken.objects.create(user=user)
        send_verification_email(user, verification_token.token)

        return Response({'detail': 'Verification email resent successfully'}, status=status.HTTP_200_OK)

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data

            PasswordResetToken.objects.filter(user=user).delete()

            reset_token = PasswordResetToken.objects.create(user=user)
            reset_token.generate_token()
            reset_token.save()

            reset_link = f"{settings.FRONTEND_URL}/reset-password/{reset_token.token}"

            self.send_password_reset_email(user, reset_link)

            return Response({
                'detail': 'Password reset link sent to your email',
                'email': user.email
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def send_password_reset_email(user, reset_link):
        subject = 'Password Reset Request - Learn English Platform'
        html_message = render_to_string('emails/password_reset.html', {
            'username': user.username,
            'reset_link': reset_link,
            'platform_name': 'Learn English Platform'
        })
        plain_message = strip_tags(html_message)

        try:
            send_mail(
                subject,
                plain_message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                html_message=html_message,
                fail_silently=False,
            )
            log_info(f"Password reset email sent to {user.email}")
        except Exception as e:
            log_error(f"Failed to send password reset email: {e}")

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)

        if serializer.is_valid():
            try:
                reset_token = PasswordResetToken.objects.get(
                    token=serializer.validated_data['token'],
                    expires_at__gt=timezone.now()
                )

                user = reset_token.user
                user.set_password(serializer.validated_data['new_password'])
                user.save()

                html_message = render_to_string('emails/password_reset_confirmation.html', {
                    'user': user,
                    'frontend_url': settings.FRONTEND_URL
                })
                plain_message = strip_tags(html_message)

                try:
                    send_mail(
                        'Password Reset Confirmation - Learn English Platform',
                        plain_message,
                        settings.EMAIL_HOST_USER,
                        [user.email],
                        html_message=html_message,
                        fail_silently=False,
                    )
                except Exception as email_error:
                    print(f"Confirmation email error: {email_error}")

                reset_token.delete()

                return Response({'detail': 'Password reset successfully', 'email': user.email}, status=status.HTTP_200_OK)
            except PasswordResetToken.DoesNotExist:
                return Response({'detail': 'Invalid or expired reset token'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UploadProfilePictureView(APIView):
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if 'profile_picture' not in request.FILES:
            return Response({"detail": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        image = request.FILES['profile_picture']

        profile_picture, created = ProfilePicture.objects.get_or_create(user=user)
        profile_picture.image = image
        profile_picture.save()

        return Response({"detail": "Profile picture uploaded successfully"}, status=status.HTTP_200_OK)

class ResetProgressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        user.reset_progress()
        return Response({"detail": "Progress reset successfully"}, status=status.HTTP_200_OK)

class NoteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    serializer_class = NoteSerializer
    queryset = Note.objects.all()

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['GET'], url_path='search')
    def search_notes(self, request):
        query = request.query_params.get('q', '')
        if query:
            notes = self.get_queryset().filter(
                Q(title__icontains=query) | Q(content__icontains=query)
            )
        else:
            notes = self.get_queryset()

        serializer = self.get_serializer(notes, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['PATCH'], url_path='change-type')
    def change_note_type(self, request, pk=None):
        note = self.get_object()
        new_type = request.data.get('note_type')

        if new_type in dict(Note.NOTE_TYPES):
            note.note_type = new_type
            note.save()
            serializer = self.get_serializer(note)
            return Response(serializer.data)

        return Response(
            {'error': 'Invalid note type'},
            status=status.HTTP_400_BAD_REQUEST
        )

class RecommendedLessonsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if not user.level:
            default_level, created = Level.objects.get_or_create(
                level_order=1,
                defaults={'name': 'Beginner', 'points_to_advance': 100, 'difficulty': 'beginner'}
            )
            user.level = default_level
            user.save()

        completed_lesson_ids = UserProgress.objects.filter(
            user=user,
            completed=True,
            lesson__level=user.level
        ).values_list('lesson_id', flat=True)

        recommended_lessons = Lesson.objects.filter(
            level=user.level
        ).exclude(
            id__in=completed_lesson_ids
        ).filter(
            pk__in=[lesson.pk for lesson in Lesson.objects.filter(level=user.level) if lesson.can_user_access(user)]
        )

        serializer = LessonSerializer(recommended_lessons, many=True, context={'request': request})
        return Response(serializer.data)

class ProfileView(APIView):
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

class UserStatisticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserStatisticsSerializer(request.user)
        return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_profile_picture(request):
    user = request.user
    try:
        profile_picture = ProfilePicture.objects.get(user=user)
        if profile_picture.image:
            profile_picture.image.delete(save=True)
        profile_picture.delete()
        return Response({"detail": "Profile picture deleted successfully"}, status=status.HTTP_200_OK)
    except ProfilePicture.DoesNotExist:
        return Response({"detail": "Profile picture not found"}, status=status.HTTP_404_NOT_FOUND)
