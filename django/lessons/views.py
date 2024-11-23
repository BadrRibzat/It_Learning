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

    @action(detail=False, methods=['post'], url_path='submit-answer')
    def submit_answer(self, request):
        serializer = FlashcardSubmissionSerializer(data=request.data)
        if serializer.is_valid():
            flashcard = get_object_or_404(
                Flashcard, 
                id=serializer.validated_data['flashcard_id']
            )
            user_answer = serializer.validated_data['user_answer']
            
            is_correct = self._check_answer(flashcard, user_answer)
            
            self._update_user_progress(request.user, flashcard, is_correct)  # Corrected method call
            
            return Response({
                'is_correct': is_correct,
                'correct_answer': flashcard.word,
                'explanation': flashcard.definition if not is_correct else None
            })
        return Response(serializer.errors, status=400)

    def _check_answer(self, flashcard, user_answer):
        return user_answer.lower().strip() == flashcard.word.lower().strip()

    def _check_flashcard_answer(self, flashcard, user_answer):
        return user_answer.lower().strip() == flashcard.word.lower().strip()

    def _update_user_progress(self, user, flashcard, is_correct):
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

    @action(detail=False, methods=['post'], url_path='submit-quiz')
    def submit_quiz(self, request):
        serializer = QuizSubmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        quiz_id = serializer.validated_data['quiz_id']
        answers = serializer.validated_data['answers']
        
        quiz = get_object_or_404(Quiz, id=quiz_id)
        
        total_questions = len(answers)
        correct_answers = self._evaluate_quiz_answers(quiz, answers)
        score = (correct_answers / total_questions) * 100
        
        self._update_quiz_progress(request.user, quiz, score)
        
        return Response({
            'score': score,
            'passed': score >= quiz.passing_score,
            'correct_answers': correct_answers,
            'total_questions': total_questions
        })

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

    @action(detail=False, methods=['post'], url_path='submit-test')
    def submit_test(self, request):
        serializer = LevelTestSubmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        level_test_id = serializer.validated_data['level_test_id']
        answers = serializer.validated_data['answers']
        
        level_test = get_object_or_404(LevelTest, id=level_test_id)
        
        total_questions = len(answers)
        correct_answers = self._evaluate_level_test_answers(level_test, answers)
        score = (correct_answers / total_questions) * 100
        
        level_unlocked = self._update_level_progress(request.user, level_test, score)
        
        return Response({
            'score': score,
            'passed': score >= level_test.passing_score,
            'correct_answers': correct_answers,
            'total_questions': total_questions,
            'level_unlocked': level_unlocked
        })

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

        lesson = level_test.level.lessons.first()
        if not lesson:

            lesson = Lesson.objects.create(
                title=f"Level {level_test.level.name} Introduction",
                level=level_test.level,
                position=1
            )
    
        progress, created = UserProgress.objects.get_or_create(
            user=user,
            level=level_test.level,
            lesson=lesson
        )
    
        progress.level_test_score = score
        progress.level_unlocked = score >= level_test.passing_score
        progress.save()
    
        return progress.level_unlocked
