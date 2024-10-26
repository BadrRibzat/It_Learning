
from rest_framework import viewsets
from .models import Lesson, Test
from .serializers import LessonSerializer, TestSerializer

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer

from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import LevelSerializer, LessonSerializer, FlashcardSerializer, QuizSerializer, QuizQuestionSerializer, LevelTestSerializer, LevelTestQuestionSerializer, UserProgressSerializer, UserFlashcardProgressSerializer, UserQuizAttemptSerializer, UserLevelProgressSerializer
from django.core.cache import cache
from django.db.models import Prefetch
from accounts.models import Badge, UserBadge
from .models import (
    Level, Lesson, Flashcard, Quiz, QuizQuestion, LevelTest, LevelTestQuestion,
    UserProgress, UserFlashcardProgress, UserQuizAttempt, UserLevelProgress
)

class LevelViewSet(viewsets.ModelViewSet):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all().select_related('level').prefetch_related(
        Prefetch('flashcard_set', queryset=Flashcard.objects.all().select_related('lesson'))
    ).order_by('level__level_order', 'level_order')
    serializer_class = LessonSerializer

    def list(self, request, *args, **kwargs):
        cache_key = 'lessons_list'
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)

        response = super().list(request, *args, **kwargs)
        cache.set(cache_key, response.data, timeout=60 * 15)
        return response

class FlashcardViewSet(viewsets.ModelViewSet):
    queryset = Flashcard.objects.all().order_by('id')
    serializer_class = FlashcardSerializer

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all().order_by('id')
    serializer_class = QuizSerializer

class QuizQuestionViewSet(viewsets.ModelViewSet):
    queryset = QuizQuestion.objects.all()
    serializer_class = QuizQuestionSerializer

class LevelTestViewSet(viewsets.ModelViewSet):
    queryset = LevelTest.objects.all()
    serializer_class = LevelTestSerializer

class LevelTestQuestionViewSet(viewsets.ModelViewSet):
    queryset = LevelTestQuestion.objects.all()
    serializer_class = LevelTestQuestionSerializer

class UserProgressViewSet(viewsets.ModelViewSet):
    queryset = UserProgress.objects.all()
    serializer_class = UserProgressSerializer

class UserFlashcardProgressViewSet(viewsets.ModelViewSet):
    queryset = UserFlashcardProgress.objects.all()
    serializer_class = UserFlashcardProgressSerializer

class UserQuizAttemptViewSet(viewsets.ModelViewSet):
    queryset = UserQuizAttempt.objects.all()
    serializer_class = UserQuizAttemptSerializer

class UserLevelProgressViewSet(viewsets.ModelViewSet):
    queryset = UserLevelProgress.objects.all()
    serializer_class = UserLevelProgressSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recommend_next_lesson(request):
    user = request.user
    completed_lessons = UserProgress.objects.filter(user=user, completed=True).values_list('lesson_id', flat=True)
    next_lesson = Lesson.objects.exclude(id__in=completed_lessons).order_by('level__level_order', 'id').first()
    if next_lesson:
        serializer = LessonSerializer(next_lesson)
        return Response(serializer.data)
    return Response({'message': 'No more lessons available'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def flashcard_submit(request, pk):
    try:
        flashcard = Flashcard.objects.get(pk=pk)
        user_answer = request.data.get('answer')
        is_correct = user_answer.lower() == flashcard.word.lower()

        progress, created = UserFlashcardProgress.objects.get_or_create(
            user=request.user, flashcard=flashcard)

        if is_correct:
            progress.complete_flashcard()
            request.user.points += 5
            request.user.save()

        lesson_progress, created = UserProgress.objects.get_or_create(
            user=request.user, lesson=flashcard.lesson)
        lesson_progress.update_progress(is_correct)

        return Response({
            'is_correct': is_correct,
            'points_earned': 5 if is_correct else 0,
            'lesson_completed': lesson_progress.completed
        })
    except Flashcard.DoesNotExist:
        return Response({'error': 'Flashcard not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def level_test_submit(request, pk):
    try:
        level_test = LevelTest.objects.get(pk=pk)
        score = request.data.get('score')

        if score is None:
            return Response({'error': 'Score is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            score = int(score)
        except ValueError:
            return Response({'error': 'Invalid score format'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        level_progress, created = UserLevelProgress.objects.get_or_create(user=user, level=level_test.level)

        if score >= 80:
            user.level += 1
            user.points += 100
            user.save()
            level_progress.complete_level()

            badge, created = Badge.objects.get_or_create(name="Level Up", description="Leveled up!")
            UserBadge.objects.create(user=user, badge=badge)

            return Response({'status': 'level up', 'points_earned': 100, 'score': score})
        else:
            return Response({'status': 'test completed', 'score': score})
    except LevelTest.DoesNotExist:
        return Response({'error': 'Level test not found'}, status=status.HTTP_404_NOT_FOUND)

