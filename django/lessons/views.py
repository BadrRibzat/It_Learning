from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Level, Lesson, Flashcard, Quiz, LevelTest, UserProgress
from .serializers import (
    LevelSerializer, LessonSerializer, FlashcardSerializer, 
    QuizSerializer, LevelTestSerializer, UserProgressSerializer,
    FlashcardSubmissionSerializer, QuizSubmissionSerializer, 
    LevelTestSubmissionSerializer
)

class LevelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Level.objects.all().order_by('position')
    serializer_class = LevelSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['GET'])
    def lessons(self, request, pk=None):
        level = self.get_object()
        lessons = level.lessons.all()
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)

class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['GET'])
    def flashcards(self, request, pk=None):
        lesson = self.get_object()
        flashcards = lesson.flashcards.all()
        serializer = FlashcardSerializer(flashcards, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def quiz(self, request, pk=None):
        lesson = self.get_object()
        quiz = lesson.quizzes.first()
        serializer = QuizSerializer(quiz)
        return Response(serializer.data)

class FlashcardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Flashcard.objects.all()
    serializer_class = FlashcardSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['POST'])
    def submit_answer(self, request):
        serializer = FlashcardSubmissionSerializer(data=request.data)
        if serializer.is_valid():
            flashcard_id = serializer.validated_data['flashcard_id']
            user_answer = serializer.validated_data['user_answer']
            
            flashcard = get_object_or_404(Flashcard, id=flashcard_id)
            
            # Check answer logic
            is_correct = self._check_flashcard_answer(flashcard, user_answer)
            
            # Update user progress
            self._update_user_progress(request.user, flashcard, is_correct)
            
            return Response({
                'is_correct': is_correct,
                'message': 'Correct' if is_correct else 'Incorrect'
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def _check_flashcard_answer(self, flashcard, user_answer):
        # Basic answer checking logic
        return user_answer.lower().strip() == flashcard.word.lower().strip()

    def _update_user_progress(self, user, flashcard, is_correct):
        # Update user progress for the specific lesson
        progress, created = UserProgress.objects.get_or_create(
            user=user,
            lesson=flashcard.lesson,
            level=flashcard.lesson.level
        )
        
        if is_correct:
            progress.completed_flashcards += 1
        
        progress.save()

class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['POST'])
    def submit_quiz(self, request):
        serializer = QuizSubmissionSerializer(data=request.data)
        if serializer.is_valid():
            quiz_id = serializer.validated_data['quiz_id']
            answers = serializer.validated_data['answers']
            
            quiz = get_object_or_404(Quiz, id=quiz_id)
            
            # Evaluate quiz
            total_questions = len(answers)
            correct_answers = self._evaluate_quiz_answers(quiz, answers)
            score = (correct_answers / total_questions) * 100
            
            # Update user progress
            self._update_quiz_progress(request.user, quiz, score)
            
            return Response({
                'score': score,
                'passed': score >= quiz.passing_score,
                'correct_answers': correct_answers,
                'total_questions': total_questions
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def _evaluate_quiz_answers(self, quiz, answers):
        correct_answers = 0
        for answer_data in answers:
            question_id = answer_data['question_id']
            user_answer = answer_data['user_answer']
            
            try:
                quiz_question = quiz.questions.get(id=question_id)
                if user_answer.lower().strip() == quiz_question.correct_answer.lower().strip():
                    correct_answers += 1
            except:
                continue
        
        return correct_answers

    def _update_quiz_progress(self, user, quiz, score):
        progress, created = UserProgress.objects.get_or_create(
            user=user,
            lesson=quiz.lesson,
            level=quiz.lesson.level
        )
        
        progress.quiz_score = score
        progress.quiz_completed = True
        progress.save()

class LevelTestViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LevelTest.objects.all()
    serializer_class = LevelTestSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['POST'])
    def submit_test(self, request):
        serializer = LevelTestSubmissionSerializer(data=request.data)
        if serializer.is_valid():
            level_test_id = serializer.validated_data['level_test_id']
            answers = serializer.validated_data['answers']
            
            level_test = get_object_or_404(LevelTest, id=level_test_id)
            
            # Evaluate level test
            total_questions = len(answers)
            correct_answers = self._evaluate_level_test_answers(level_test, answers)
            score = (correct_answers / total_questions) * 100
            
            # Update user progress
            level_unlocked = self._update_level_progress(request.user, level_test, score)
            
            return Response({
                'score': score,
                'passed': score >= level_test.passing_score,
                'correct_answers': correct_answers,
                'total_questions': total_questions,
                'level_unlocked': level_unlocked
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def _evaluate_level_test_answers(self, level_test, answers):
        correct_answers = 0
        for answer_data in answers:
            question_id = answer_data['question_id']
            user_answer = answer_data['user_answer']
            
            try:
                test_question = level_test.questions.get(id=question_id)
                if user_answer.lower().strip() == test_question.correct_answer.lower().strip():
                    correct_answers += 1
            except:
                continue
        
        return correct_answers

    def _update_level_progress(self, user, level_test, score):
        progress, created = UserProgress.objects.get_or_create(
            user=user,
            level=level_test.level
        )
        
        progress.level_test_score = score
        progress.level_unlocked = score >= level_test.passing_score
        progress.save()
        
        return progress.level_unlocked
