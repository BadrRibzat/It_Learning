from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    UserRegistrationView,
    LoginView,
    LogoutView,
    ProfileView,
    UserStatisticsView,
    UploadProfilePictureView,
    delete_profile_picture,
    ResetProgressView,
    NoteViewSet,
    RecommendedLessonsView,
    EmailVerificationView,
    ResendVerificationEmailView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    MultiFactorAuthView,
    ResetProgressDetailsView
)

router = DefaultRouter()
router.register(r'notes', NoteViewSet, basename='note')

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('mfa/setup/', MultiFactorAuthView.as_view(), name='mfa-setup'),
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify-email/', EmailVerificationView.as_view(), name='email_verification'),
    path('resend-verification/', ResendVerificationEmailView.as_view(), name='resend_verification'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
path('profile/<str:username>/', ProfileView.as_view(), name='user_profile'),
path('statistics/<str:username>/', UserStatisticsView.as_view(), name='user_statistics'),
    path('reset-progress/', ResetProgressView.as_view(), name='reset_progress'),
    path('reset-progress-details/', ResetProgressDetailsView.as_view(), name='reset_progress_details'),
    path('upload-profile-picture/', UploadProfilePictureView.as_view(), name='upload_profile_picture'),
    path('delete-profile-picture/', delete_profile_picture, name='delete_profile_picture'),
    path('recommended-lessons/', RecommendedLessonsView.as_view(), name='recommended_lessons'),
    path('', include(router.urls)),
]
