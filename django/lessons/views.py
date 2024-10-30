from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import (
    LevelSerializer, LessonSerializer, FlashcardSerializer, QuizSerializer,
    QuizQuestionSerializer, UserProgressSerializer, UserFlashcardProgressSerializer,
    UserQuizAttemptSerializer, UserLevelProgressSerializer, LevelTestSerializer,
    LevelTestQuestionSerializer
)
from .models import (
    Level, Lesson, Flashcard, Quiz, QuizQuestion, UserProgress,
    UserFlashcardProgress, UserQuizAttempt, UserLevelProgress, LevelTest,
    LevelTestQuestion
)

class LevelViewSet(viewsets.ModelViewSet):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer

    @action(detail=True, methods=['get'])
    def lessons(self, request, pk=None):
        level = self.get_object()
        lessons = Lesson.objects.filter(level=level)
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        level_id = self.request.query_params.get('level', None)
        if level_id is not None:
            queryset = queryset.filter(level_id=level_id)
        return queryset

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
    flashcard = get_object_or_404(Flashcard, pk=pk)
    user_answer = request.data.get('answer')
    is_correct = user_answer.lower() == flashcard.word.lower()

    progress, created = UserFlashcardProgress.objects.get_or_create(
        user=request.user, flashcard=flashcard)

    if is_correct:
        progress.completed = True
        progress.save()
        request.user.points += 5
        request.user.save()

    lesson_progress, created = UserProgress.objects.get_or_create(
        user=request.user, lesson=flashcard.lesson)
    lesson_progress.correct_answers += 1 if is_correct else 0
    lesson_progress.total_questions += 1
    lesson_progress.save()

    return Response({
        'is_correct': is_correct,
        'points_earned': 5 if is_correct else 0,
        'lesson_completed': lesson_progress.completed
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def level_test_submit(request, pk):
    level_test = get_object_or_404(LevelTest, pk=pk)
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
        level_progress.completed = True
        level_progress.save()

    return Response({'status': 'level up', 'points_earned': 100, 'score': score})
