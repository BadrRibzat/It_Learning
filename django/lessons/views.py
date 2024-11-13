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
    UserProgress, LevelTest, LevelTestQuestion
)
from .serializers import (
    LevelSerializer, LessonSerializer, FlashcardSerializer, 
    QuizSerializer, UserProgressSerializer
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
            current_level = max(1, user.level or 1)
            queryset = Lesson.objects.filter(level__level_order__lte=current_level)
            
            return queryset.order_by('id')
        except Exception as e:
            # Log the error
            logger.error(f"Error retrieving lessons: {e}")
            return Lesson.objects.none()

    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
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
    @action(detail=True, methods=['POST'], url_path='check-answer')
    def check_answer(self, request, pk=None):
        points = 0  # Initialize points before the if block
if is_correct:
    # Calculate points (decreasing with more attempts)
    points = max(1, 5 - flashcard_progress.attempts)
    flashcard_progress.is_completed = True
    flashcard_progress.points_earned = points

    # Update user points
    user.points += points
    user.save()

return Response({
    'is_correct': is_correct,
    'correct_answer': flashcard.word,
    'points_earned': points,  # Use the defined points variable
    'attempts_left': max(0, 3 - flashcard_progress.attempts),
    'total_points': user.points
})
        try:
            flashcard = self.get_object()
            user = request.user
            
            # Validate answer
            user_answer = request.data.get('answer', '').strip()
            if not user_answer:
                return Response({
                    'error': 'Answer cannot be empty'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Compare answers
            is_correct = user_answer.lower() == flashcard.word.lower()
            
            with transaction.atomic():
                # Create or update UserFlashcardProgress
                flashcard_progress, created = UserFlashcardProgress.objects.get_or_create(
                    user=user,
                    flashcard=flashcard
                )
                
                # Update progress
                flashcard_progress.attempts += 1
                flashcard_progress.last_attempt = timezone.now()
                
                if is_correct:
                    # Calculate points (decreasing with more attempts)
                    points = max(1, 5 - flashcard_progress.attempts)
                    flashcard_progress.is_completed = True
                    flashcard_progress.points_earned = points
                    
                    # Update user points
                    user.points += points
                    user.save()
                
                flashcard_progress.save()

            return Response({
                'is_correct': is_correct,
                'correct_answer': flashcard.word,
                'points_earned': points if is_correct else 0,
                'attempts_left': max(0, 3 - flashcard_progress.attempts),
                'total_points': user.points
            })

        except Exception as e:
            logger.error(f"Flashcard answer error: {e}")
            return Response({
                'error': 'An unexpected error occurred',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class QuizViewSet(viewsets.ModelViewSet):
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
                points = 0  # Initialize points before the if block
if is_correct:
    # Calculate points (decreasing with more attempts)
    points = max(1, 5 - flashcard_progress.attempts)
    flashcard_progress.is_completed = True
    flashcard_progress.points_earned = points

    # Update user points
    user.points += points
    user.save()

return Response({
    'is_correct': is_correct,
    'correct_answer': flashcard.word,
    'points_earned': points,  # Use the defined points variable
    'attempts_left': max(0, 3 - flashcard_progress.attempts),
    'total_points': user.points
})
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
