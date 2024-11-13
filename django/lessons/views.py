from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone
import logging
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db import transaction

from .models import (
    Level, Lesson, Flashcard, Quiz, QuizQuestion, 
    UserProgress, LevelTest, LevelTestQuestion,
    UserFlashcardProgress, UserQuizAttempt
)
from .serializers import (
    LevelSerializer, LessonSerializer, FlashcardSerializer, 
    QuizSerializer, UserProgressSerializer,
    LevelTestSerializer
)

logger = logging.getLogger(__name__)

class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class LessonViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = LessonSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        try:
            user = self.request.user
            # Ensure user has a valid level
            current_level = max(1, getattr(user, 'level', 1))
    
            # Error logging and fallback
            try:
                # Explicitly select related to reduce database queries
                queryset = Lesson.objects.filter(level__level_order__lte=current_level).select_related('level')
            except Exception as db_error:
                logger.error(f"Database query error: {db_error}")
                # Fallback to all lessons if there's a database error
                queryset = Lesson.objects.all()
    
            return queryset.order_by('id')
        except Exception as e:
            logger.error(f"Error retrieving lessons: {e}")
            return Lesson.objects.none()

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.filter_queryset(self.get_queryset())
        
            # Check if queryset is empty
            if not queryset.exists():
                return Response({
                    'error': 'No lessons found',
                    'details': 'Unable to retrieve lessons for the current user level'
                }, status=status.HTTP_404_NOT_FOUND)
        
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error in lesson list: {e}")
            return Response({
                'error': 'Unable to retrieve lessons',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['POST'])
    def submit_quiz(self, request, pk=None):
        try:
            quiz = Quiz.objects.get(lesson_id=pk)
            answers = request.data.get('answers', [])
            
            total_questions = quiz.questions.count()
            correct_answers = 0

            for answer_data in answers:
                question = QuizQuestion.objects.get(id=answer_data['question_id'])
                if answer_data['answer'] == question.correct_answer:
                    correct_answers += 1

            score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0

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
        except Quiz.DoesNotExist:
            logger.error(f"Quiz not found for lesson {pk}")
            return Response({
                'error': 'Quiz not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error submitting quiz: {e}")
            return Response({
                'error': 'An unexpected error occurred while submitting the quiz'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FlashcardViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Flashcard.objects.all()
    serializer_class = FlashcardSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        lesson_id = self.request.query_params.get('lesson_id', '')
        if lesson_id:
            try:
                lesson_id = int(lesson_id)
                return Flashcard.objects.filter(lesson_id=lesson_id)
            except (ValueError, TypeError):
                logger.warning(f"Invalid lesson_id provided: {lesson_id}")
                return Flashcard.objects.none()
    
        # If no lesson_id, limit to current user's level
        try:
            user = self.request.user
            current_level = max(1, getattr(user, 'level', 1))
            return Flashcard.objects.filter(lesson__level__level_order__lte=current_level)
        except Exception as e:
            logger.error(f"Error retrieving flashcards: {e}")
            return Flashcard.objects.none()

    @action(detail=True, methods=['POST'], url_path='check-answer')
    def check_answer(self, request, pk=None):
        try:
            flashcard = self.get_object()
            if not flashcard:
                return Response({
                    'error': 'Flashcard not found'
                }, status=status.HTTP_404_NOT_FOUND)

            user_answer = request.data.get('answer', '').strip()
            if not user_answer:
                return Response({
                    'error': 'Answer cannot be empty'
                }, status=status.HTTP_400_BAD_REQUEST)

            is_correct = user_answer.lower() == flashcard.word.lower()
            
            return Response({
                'is_correct': is_correct,
                'correct_answer': flashcard.word
            })
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class QuizViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = QuizSerializer
    
    def get_queryset(self):
        lesson_id = self.kwargs.get('pk')
        return Quiz.objects.filter(lesson_id=lesson_id)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['POST'], url_path='submit')
    def submit_quiz(self, request, pk=None):
        try:
            quiz = self.get_object()
            user = request.user
            answers = request.data.get('answers', [])
            
            total_questions = quiz.questions.count()
            correct_answers = 0
            detailed_results = []

            with transaction.atomic():
                # Track quiz attempt
                quiz_attempt, created = UserQuizAttempt.objects.get_or_create(
                    user=user,
                    quiz=quiz
                )
                quiz_attempt.attempts += 1
                
                # Process each question
                for answer_data in answers:
                    question_id = answer_data.get('question_id')
                    user_answer = answer_data.get('answer')
                    
                    try:
                        question = QuizQuestion.objects.get(id=question_id, quiz=quiz)
                        is_correct = user_answer == question.correct_answer
                        
                        if is_correct:
                            correct_answers += 1
                        
                        detailed_results.append({
                            'question_id': question_id,
                            'is_correct': is_correct,
                            'correct_answer': question.correct_answer
                        })
                    except QuizQuestion.DoesNotExist:
                        logger.warning(f"Question {question_id} not found")
                
                # Calculate score
                score = (correct_answers / total_questions) * 100
                is_passed = score >= quiz.passing_score
                
                # Update quiz attempt
                quiz_attempt.total_score = score
                quiz_attempt.is_passed = is_passed
                quiz_attempt.completed_at = timezone.now()
                quiz_attempt.save()
                
                # Update user points if quiz is passed
                if is_passed:
                    user.points += quiz.lesson.points_to_complete
                    user.save()

            return Response({
                'score': score,
                'is_passed': is_passed,
                'total_questions': total_questions,
                'correct_answers': correct_answers,
                'detailed_results': detailed_results,
                'attempts_left': max(0, quiz.max_attempts - quiz_attempt.attempts),
                'total_points': user.points
            })

        except Exception as e:
            logger.error(f"Quiz submission error: {e}")
            return Response({
                'error': 'An unexpected error occurred during quiz submission',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LevelTestViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = LevelTestSerializer

    def get_queryset(self):
        try:
            user = self.request.user
            current_level = max(1, getattr(user, 'level', 1))
            return LevelTest.objects.filter(level__level_order__lte=current_level)
        except Exception as e:
            logger.error(f"Error retrieving level tests: {e}")
            return LevelTest.objects.none()

    @action(detail=True, methods=['GET'], url_path='get-test')
    def get_test(self, request, pk=None):
        try:
            level_test = self.get_object()
            serializer = self.get_serializer(level_test)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error getting level test: {e}")
            return Response({
                'error': 'Unable to retrieve level test',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['POST'], url_path='submit')
    def submit_test(self, request, pk=None):
        try:
            level_test = self.get_object()
            user = request.user
            answers = request.data.get('answers', [])

            total_questions = level_test.questions.count()
            correct_answers = 0
            detailed_results = []

            with transaction.atomic():
                # Process each question
                for answer_data in answers:
                    question_id = answer_data.get('question_id')
                    user_answer = answer_data.get('answer')

                    try:
                        question = LevelTestQuestion.objects.get(id=question_id, level_test=level_test)
                        is_correct = user_answer == question.correct_answer

                        if is_correct:
                            correct_answers += 1

                        detailed_results.append({
                            'question_id': question_id,
                            'is_correct': is_correct,
                            'correct_answer': question.correct_answer
                        })
                    except LevelTestQuestion.DoesNotExist:
                        logger.warning(f"Question {question_id} not found")

                # Calculate score
                score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
                is_passed = score >= level_test.passing_score

                # Update user level if test is passed
                if is_passed:
                    next_level = Level.objects.filter(level_order=level_test.level.level_order + 1).first()
                    if next_level:
                        user.level = next_level
                        user.save()

                return Response({
                    'score': score,
                    'is_passed': is_passed,
                    'total_questions': total_questions,
                    'correct_answers': correct_answers,
                    'detailed_results': detailed_results,
                    'next_level': next_level.name if next_level else None
                })

        except Exception as e:
            logger.error(f"Level test submission error: {e}")
            return Response({
                'error': 'An unexpected error occurred during level test submission',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserProgressViewSet(viewsets.ViewSet):
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['GET'])
    def progress(self, request):
        try:
            user = request.user

            # Aggregate user progress
            completed_lessons = UserProgress.objects.filter(user=user, completed=True).count()
            total_lessons = Lesson.objects.count()

            # Calculate quiz performance
            # Use safe method to avoid potential None errors
            quiz_attempts = UserQuizAttempt.objects.filter(user=user)
            passed_quizzes = quiz_attempts.filter(is_passed=True).count() if quiz_attempts.exists() else 0
            total_quizzes = quiz_attempts.count() if quiz_attempts.exists() else 0

            # Flashcard progress
            completed_flashcards = UserFlashcardProgress.objects.filter(user=user, is_completed=True).count()
            total_flashcards = Flashcard.objects.count()

            return Response({
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
            })
        except Exception as e:
            logger.error(f"Error retrieving user progress: {e}")
            return Response({
                'error': 'Unable to retrieve user progress',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
