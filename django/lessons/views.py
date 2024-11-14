from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.db import transaction
from django.utils import timezone
from django.db.models import Q, Count

from .models import (
    Level, Lesson, Flashcard, Quiz, QuizQuestion, 
    LevelTest, LevelTestQuestion,
    UserProgress, UserFlashcardProgress, 
    UserQuizAttempt, UserLevelTestProgress
)
from .serializers import (
    LevelSerializer, LessonSerializer, FlashcardSerializer, 
    QuizSerializer, LevelTestSerializer,
    UserProgressSerializer, UserFlashcardProgressSerializer,
    QuizSubmissionSerializer, LevelTestSubmissionSerializer,
    UserLearningProgressSerializer
)

import logging
logger = logging.getLogger(__name__)

class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class LevelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Level.objects.all().order_by('level_order')

    @action(detail=True, methods=['GET'])
    def lessons(self, request, pk=None):
        level = self.get_object()
        lessons = Lesson.objects.filter(level=level)
        serializer = LessonSerializer(lessons, many=True, context={'request': request})
        return Response(serializer.data)

class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Filter lessons based on user's current level and accessibility
        return Lesson.objects.filter(
            level__level_order__lte=user.level.level_order if user.level else 1
        ).order_by('id')

    @action(detail=True, methods=['GET'])
    def flashcards(self, request, pk=None):
        lesson = self.get_object()
        flashcards = Flashcard.objects.filter(lesson=lesson).order_by('order')
        serializer = FlashcardSerializer(flashcards, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def quizzes(self, request, pk=None):
        lesson = self.get_object()
        quizzes = Quiz.objects.filter(lesson=lesson)
        serializer = QuizSerializer(quizzes, many=True)
        return Response(serializer.data)

class FlashcardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Flashcard.objects.all()
    serializer_class = FlashcardSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['POST'])
    def check_answer(self, request, pk=None):
        try:
            flashcard = self.get_object()
            user = request.user
            answer = request.data.get('answer', '').strip()

            # Check if answer is correct
            is_correct = answer.lower() == flashcard.word.lower()

            # Create or update user flashcard progress
            with transaction.atomic():
                progress, created = UserFlashcardProgress.objects.get_or_create(
                    user=user,
                    flashcard=flashcard
                )

                # Update progress
                progress.attempts += 1
                progress.last_attempt = timezone.now()
                
                if is_correct:
                    progress.completed = True
                    progress.points_earned += 10  # Configurable points
                
                progress.save()

                # Update lesson progress if all flashcards are completed
                lesson_flashcards = Flashcard.objects.filter(lesson=flashcard.lesson)
                completed_flashcards = UserFlashcardProgress.objects.filter(
                    user=user,
                    flashcard__in=lesson_flashcards,
                    completed=True
                )

                if completed_flashcards.count() == lesson_flashcards.count():
                    UserProgress.objects.update_or_create(
                        user=user,
                        lesson=flashcard.lesson,
                        defaults={
                            'completed': True,
                            'completed_at': timezone.now()
                        }
                    )

            return Response({
                'is_correct': is_correct,
                'correct_answer': flashcard.word,
                'points_earned': progress.points_earned
            })

        except Exception as e:
            logger.error(f"Flashcard answer check error: {e}")
            return Response({
                'error': 'An error occurred while processing your answer'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['POST'])
    def submit(self, request, pk=None):
        try:
            quiz = self.get_object()
            user = request.user
            
            # Validate submission
            serializer = QuizSubmissionSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Process quiz submission
            answers = serializer.validated_data['answers']
            total_questions = quiz.total_questions
            correct_answers = 0

            with transaction.atomic():
                # Validate all flashcards are completed
                lesson_flashcards = Flashcard.objects.filter(lesson=quiz.lesson)
                completed_flashcards = UserFlashcardProgress.objects.filter(
                    user=user,
                    flashcard__in=lesson_flashcards,
                    completed=True
                )

                if completed_flashcards.count() != lesson_flashcards.count():
                    return Response({
                        'error': 'Complete all flashcards before taking the quiz'
                    }, status=status.HTTP_400_BAD_REQUEST)

                # Check answers
                for answer_data in answers:
                    question = QuizQuestion.objects.get(id=answer_data['flashcard_id'])
                    if answer_data['answer'].lower() == question.correct_answer.lower():
                        correct_answers += 1

                # Calculate score
                score = (correct_answers / total_questions) * 100
                is_passed = score >= quiz.passing_score

                # Update quiz attempt
                quiz_attempt, _ = UserQuizAttempt.objects.get_or_create(
                    user=user,
                    quiz=quiz
                )
                quiz_attempt.total_score = score
                quiz_attempt.is_passed = is_passed
                quiz_attempt.attempts += 1
                quiz_attempt.completed_at = timezone.now()
                quiz_attempt.save()

                # Update lesson progress
                UserProgress.objects.update_or_create(
                    user=user,
                    lesson=quiz.lesson,
                    defaults={
                        'completed': is_passed,
                        'score': score,
                        'total_questions': total_questions,
                        'correct_answers': correct_answers,
                        'completed_at': timezone.now() if is_passed else None
                    }
                )

            return Response({
                'score': score,
                'is_passed': is_passed,
                'total_questions': total_questions,
                'correct_answers': correct_answers
            })

        except Exception as e:
            logger.error(f"Quiz submission error: {e}")
            return Response({
                'error': 'An error occurred while submitting the quiz'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LevelTestViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LevelTest.objects.all()
    serializer_class = LevelTestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Filter level tests based on user's current level
        return LevelTest.objects.filter(
            level__level_order__lte=user.level.level_order if user.level else 1
        )

    @action(detail=True, methods=['GET'])
    def questions(self, request, pk=None):
        level_test = self.get_object()
        questions = LevelTestQuestion.objects.filter(level_test=level_test).order_by('order')
        serializer = LevelTestQuestionSerializer(questions, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['POST'])
    def submit(self, request, pk=None):
        try:
            level_test = self.get_object()
            user = request.user

            # Validate submission
            serializer = LevelTestSubmissionSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Process level test submission
            answers = serializer.validated_data['answers']
            total_questions = level_test.total_questions
            correct_answers = 0

            with transaction.atomic():
                # Check answers
                for answer_data in answers:
                    question = LevelTestQuestion.objects.get(id=answer_data['question_id'])
                    if answer_data['answer'].lower() == question.correct_answer.lower():
                        correct_answers += 1

                # Calculate score
                score = (correct_answers / total_questions) * 100
                is_passed = score >= level_test.passing_score

                # Update level test progress
                level_test_progress, _ = UserLevelTestProgress.objects.get_or_create(
                    user=user,
                    level_test=level_test
                )
                level_test_progress.is_passed = is_passed
                level_test_progress.score = score
                level_test_progress.total_questions = total_questions
                level_test_progress.completed_at = timezone.now()
                level_test_progress.save()

                # If test is passed, potentially unlock next level
                if is_passed and level_test.level.next_level:
                    user.level = level_test.level.next_level
                    user.save()

                return Response({
                    'score': score,
                    'is_passed': is_passed,
                    'total_questions': total_questions,
                    'correct_answers': correct_answers,
                    'next_level': level_test.level.next_level.name if is_passed and level_test.level.next_level else None
                })

        except Exception as e:
            logger.error(f"Level Test submission error: {e}")
            return Response({
                'error': 'An error occurred while submitting the level test'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserProgressViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['GET'])
    def learning_progress(self, request):
        try:
            user = request.user

            # Aggregate learning progress
            completed_lessons = UserProgress.objects.filter(user=user, completed=True).count()
            total_lessons = Lesson.objects.count()

            # Quiz performance
            passed_quizzes = UserQuizAttempt.objects.filter(user=user, is_passed=True).count()
            total_quizzes = UserQuizAttempt.objects.filter(user=user).count()

            # Flashcard progress
            completed_flashcards = UserFlashcardProgress.objects.filter(user=user, completed=True).count()
            total_flashcards = Flashcard.objects.count()

            progress_data = {
                'level': user.level.id if user.level else None,
                'level_name': user.level.name if user.level else 'Beginner',
                'points': user.points,
                'completed_lessons': completed_lessons,
                'total_lessons': total_lessons,
                'lesson_progress_percentage': (completed_lessons / total_lessons * 100) if total_lessons > 0 else 0,
                'passed_quizzes': passed_quizzes,
                'total_quizzes': total_quizzes,
                'quiz_progress_percentage': (passed_quizzes / total_quizzes * 100) if total_quizzes > 0 else 0,
                'completed_flashcards': completed_flashcards,
                'total_flashcards': total_flashcards,
                'flashcard_progress_percentage': (completed_flashcards / total_flashcards * 100) if total_flashcards > 0 else 0
            }

            serializer = UserLearningProgressSerializer(data=progress_data)
            serializer.is_valid(raise_exception=True)

            return Response(serializer.data)

        except Exception as e:
            logger.error(f"Learning progress error: {e}")
            return Response({
                'error': 'An error occurred while retrieving learning progress'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['GET'])
    def detailed_progress(self, request):
        # Provide more comprehensive progress details
        # Similar to learning_progress, but with more granular information
        pass

    @action(detail=False, methods=['GET'])
    def completed_lessons(self, request):
        completed = UserProgress.objects.filter(
            user=request.user, 
            completed=True
        ).select_related('lesson')
        serializer = UserProgressSerializer(completed, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def current_level_details(self, request):
        user = request.user
        if not user.level:
            return Response({
                'error': 'No current level found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = LevelSerializer(user.level, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def recommended_lessons(self, request):
        user = request.user
        
        # Find lessons in the user's current level that are not completed
        recommended = Lesson.objects.filter(
            level=user.level
        ).exclude(
            userprogress__user=user,
            userprogress__completed=True
        )
        
        serializer = LessonSerializer(
            recommended, 
            many=True, 
            context={'request': request}
        )
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def learning_metrics(self, request):
        # Provide advanced learning metrics
        # Could include things like:
        # - Time spent learning
        # - Streak information
        # - Comparative progress
        pass

    @action(detail=False, methods=['GET'])
    def level_test_history(self, request):
        """
        Retrieve user's level test history
        """
        try:
            user = request.user
            level_test_history = UserLevelTestProgress.objects.filter(user=user).select_related('level_test__level')
            
            history_data = []
            for attempt in level_test_history:
                history_data.append({
                    'level_name': attempt.level_test.level.name,
                    'score': attempt.score,
                    'is_passed': attempt.is_passed,
                    'completed_at': attempt.completed_at,
                    'total_questions': attempt.total_questions
                })

            return Response(history_data)

        except Exception as e:
            logger.error(f"Level test history retrieval error: {e}")
            return Response({
                'error': 'An error occurred while retrieving level test history'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['GET'])
    def comprehensive_learning_report(self, request):
        """
        Generate a comprehensive learning report
        """
        try:
            user = request.user

            # Detailed learning metrics
            report = {
                'overall_progress': self.learning_progress(request).data,
                'lessons': {
                    'completed': self.completed_lessons(request).data,
                    'recommended': self.recommended_lessons(request).data
                },
                'level_tests': {
                    'history': self.level_test_history(request).data,
                    'current_level': self.current_level_details(request).data
                },
                'performance_metrics': {
                    'total_time_spent': self.calculate_learning_time(user),
                    'learning_streak': self.calculate_learning_streak(user)
                }
            }

            return Response(report)

        except Exception as e:
            logger.error(f"Comprehensive learning report error: {e}")
            return Response({
                'error': 'An error occurred while generating learning report'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def calculate_learning_time(self, user):
        """
        Calculate total learning time
        """
        # Implement logic to track and calculate learning time
        # This could involve creating a separate model to track learning sessions
        return 0  # Placeholder

    def calculate_learning_streak(self, user):
        """
        Calculate user's learning streak
        """
        # Implement logic to calculate consecutive learning days
        return 0  # Placeholder
