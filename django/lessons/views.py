from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from .models import (
    Level, Lesson, Flashcard, Quiz, QuizQuestion, 
    UserProgress, LevelTest, LevelTestQuestion
)
from .serializers import (
    LevelSerializer, LessonSerializer, FlashcardSerializer, 
    QuizSerializer, UserProgressSerializer
)

class LessonViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = LessonSerializer
    queryset = Lesson.objects.all()

    def get_queryset(self):
        user = self.request.user
        return Lesson.objects.filter(level__level_order__lte=user.level)

    @action(detail=True, methods=['POST'])
    def submit_quiz(self, request, pk=None):
        quiz = Quiz.objects.get(lesson_id=pk)
        answers = request.data.get('answers', [])
        
        total_questions = quiz.questions.count()
        correct_answers = 0

        for answer_data in answers:
            question = QuizQuestion.objects.get(id=answer_data['question_id'])
            if answer_data['answer'] == question.correct_answer:
                correct_answers += 1

        score = (correct_answers / total_questions) * 100

        # Update user progress
        user_progress, created = UserProgress.objects.get_or_create(
            user=request.user, 
            lesson_id=pk
        )
        user_progress.score = score
        user_progress.total_questions = total_questions
        user_progress.completed = score >= quiz.passing_score
        user_progress.completed_at = timezone.now()
        user_progress.save()

        return Response({
            'score': score,
            'passed': user_progress.completed,
            'total_questions': total_questions,
            'correct_answers': correct_answers
        })

class FlashcardViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Flashcard.objects.all()
    serializer_class = FlashcardSerializer

    def get_queryset(self):
        lesson_id = self.request.query_params.get('lesson_id')
        if lesson_id:
            return Flashcard.objects.filter(lesson_id=lesson_id)
        return super().get_queryset()

    @action(detail=True, methods=['POST'])
    def check_answer(self, request, pk=None):
        flashcard = self.get_object()
        user_answer = request.data.get('answer', '').strip()
        correct_answer = flashcard.word

        is_correct = user_answer.lower() == correct_answer.lower()

    # Update user progress
        user_progress, created = UserProgress.objects.get_or_create(
            user=request.user, 
            lesson=flashcard.lesson
        )
    
        if is_correct:
            request.user.points += 5
            request.user.save()

        return Response({
            'is_correct': is_correct,
            'correct_answer': correct_answer,
            'points_earned': 5 if is_correct else 0
        })
