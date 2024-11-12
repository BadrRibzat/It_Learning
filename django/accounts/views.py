from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import (
    status, 
    viewsets, 
    permissions, 
    serializers
)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth import get_user_model
from django.utils import timezone
import os
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from .serializers import (
    UserSerializer, 
    UserRegistrationSerializer, 
    UserProfileSerializer, 
    UserStatisticsSerializer, 
    NoteSerializer,
    CustomTokenObtainPairSerializer,
    EmailVerificationSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer
)
from .models import (
    User, 
    Note, 
    ProfilePicture, 
    EmailVerificationToken,
    PasswordResetToken
)
from lessons.models import UserProgress, Lesson
from lessons.serializers import LessonSerializer

from .utils import send_verification_email, send_password_reset_email

User = get_user_model()

class UserRegistrationView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        try:
            if serializer.is_valid(raise_exception=True):
                user = serializer.save()
                return Response({
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'language': user.language
                }, status=status.HTTP_201_CREATED)
        except serializers.ValidationError as e:
            return Response({
                'errors': e.detail
            }, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class LoginView(CustomTokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    pass

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class EmailVerificationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = EmailVerificationSerializer(data=request.data)
        
        if serializer.is_valid():
            verification = serializer.validated_data['token']
            user = verification.user
            
            # Mark user as verified
            user.is_verified = True
            user.save()
            
            # Delete the used token
            verification.delete()
            
            return Response({
                'detail': 'Email verified successfully'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResendVerificationEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        
        # Delete existing verification tokens
        EmailVerificationToken.objects.filter(user=user).delete()
        
        # Create new verification token
        verification_token = EmailVerificationToken.objects.create(user=user)
        
        # Send verification email
        send_verification_email(user, verification_token.token)
        
        return Response({
            'detail': 'Verification email resent successfully'
        }, status=status.HTTP_200_OK)

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data
            
            # Create or update password reset token
            reset_token, created = PasswordResetToken.objects.get_or_create(user=user)
            reset_token.generate_token()
            reset_token.save()
            
            # Construct password reset link
            reset_link = f"{settings.FRONTEND_URL}/reset-password/{reset_token.token}"
            
            # Render HTML email template
            html_message = render_to_string('emails/password_reset.html', {
                'user': user,
                'reset_link': reset_link,
                'frontend_url': settings.FRONTEND_URL
            })
            
            # Plain text version
            plain_message = strip_tags(html_message)
            
            try:
                send_mail(
                    'Password Reset Request - Learn English Platform',
                    plain_message,
                    settings.EMAIL_HOST_USER,  # Use the email from .env
                    [user.email],
                    html_message=html_message,
                    fail_silently=False,
                )
                
                return Response({
                    'detail': 'Password reset link sent to your email',
                    'email': user.email
                }, status=status.HTTP_200_OK)
            
            except Exception as e:
                # Log the error (you might want to use proper logging)
                print(f"Email sending error: {e}")
                return Response({
                    'detail': 'Failed to send password reset email. Please try again later.',
                    'error': str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
                
                # Send confirmation email
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
                    # Log the error, but don't prevent password reset
                    print(f"Confirmation email error: {email_error}")
                
                # Delete used token
                reset_token.delete()
                
                return Response({
                    'detail': 'Password reset successfully',
                    'email': user.email
                }, status=status.HTTP_200_OK)
            
            except PasswordResetToken.DoesNotExist:
                return Response({
                    'detail': 'Invalid or expired reset token'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UploadProfilePictureView(APIView):
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

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

        profile_picture, created = ProfilePicture.objects.get_or_create(user=user)
        profile_picture.image = image
        profile_picture.save()

        return Response({"detail": "Profile picture uploaded successfully"}, status=status.HTTP_200_OK)

class ResetProgressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        if not user.id:
            return Response({"detail": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

        user.reset_progress()

        return Response({"detail": "Progress reset successfully"}, status=status.HTTP_200_OK)

class NoteViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = NoteSerializer

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except serializers.ValidationError as e:
            return Response({
                'error': 'Validation failed',
                'details': e.detail
            }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except serializers.ValidationError as e:
            return Response({
                'error': 'Validation failed',
                'details': e.detail
            }, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({
                'error': 'Failed to delete note',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class RecommendedLessonsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        recommended_lessons = user.get_recommended_lessons()
        serializer = LessonSerializer(recommended_lessons, many=True)
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
