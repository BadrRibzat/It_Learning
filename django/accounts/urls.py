from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from rest_framework_simplejwt.views import TokenRefreshView
from .views import ( CustomTokenObtainPairView, RegisterView, LoginView, ProfileView, UserStatisticsView, PasswordResetView, PasswordResetConfirmView, LogoutView, ResetProgressView, UploadProfilePictureView, NoteViewSet, RecommendedLessonsView, update_current_lesson )

router = DefaultRouter()
router.register(r'notes', NoteViewSet, basename='note')

urlpatterns = [
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('register/', RegisterView.as_view(), name='register'),

    path('profile/', ProfileView.as_view(), name='user_profile'),
    path('statistics/', UserStatisticsView.as_view(), name='user_statistics'),
    path('user-progress/', UserProgressView.as_view(), name='user_progress'),
    path('password-reset/', PasswordResetView.as_view(), name='password_reset'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset-progress/', ResetProgressView.as_view(), name='reset_progress'),
    path('upload-profile-picture/', UploadProfilePictureView.as_view(), name='upload_profile_picture'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('recommended-lessons/', RecommendedLessonsView.as_view(), name='recommended_lessons'),
    path('', include(router.urls)),
    path('check-user/', views.check_user, name='check_user'),
    path('update-current-lesson/', update_current_lesson, name='update_current_lesson'),
]
