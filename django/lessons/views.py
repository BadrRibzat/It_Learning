from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from django.db import transaction
from django.utils import timezone
from django.db.models import Q, Count, F

from .models import (
    Level, Lesson, Flashcard, Quiz, QuizQuestion,
    LevelTest, LevelTestQuestion,
    UserProgress, UserFlashcardProgress,
    UserQuizAttempt, UserLevelTestProgress,
    UserQuizProgress
)
from .serializers import (
    LevelSerializer, LessonSerializer, FlashcardSerializer,
    QuizSerializer, LevelTestSerializer,
    UserProgressSerializer, UserFlashcardProgressSerializer,
    QuizSubmissionSerializer, LevelTestSubmissionSerializer,
    UserLearningProgressSerializer, UserLearningMetricsSerializer, 
    ComprehensiveLearningReportSerializer,
    )

import logging
logger = logging.getLogger(__name__)

class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class LevelViewSet(viewsets.ModelViewSet):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

    def list(self, request, *args, **kwargs):
        logger.info("Fetching levels")
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        logger.info("Creating level")
        return super().create(request, *args, **kwargs)

    def get_queryset(self):
        user = self.request.user
        return Level.objects.all().order_by('level_order')

    @action(detail=True, methods=['GET'])
    def lessons(self, request, pk=None):
        level = self.get_object()
        lessons = Lesson.objects.filter(level=level)
        serializer = LessonSerializer(lessons, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def tests(self, request, pk=None):
        level = self.get_object()
        tests = LevelTest.objects.filter(level=level)
        serializer = LevelSerializer(level, context={'request': request})
        return Response(serializer.data)

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if not user.level:
            beginner_level = Level.objects.filter(difficulty="beginner").first()
            return Lesson.objects.filter(level=beginner_level)

        return Lesson.objects.filter(Q(level=user.level) | Q(is_unlocked=True)).filter(
            pk__in=[lesson.pk for lesson in Lesson.objects.filter(Q(level=user.level) | Q(is_unlocked=True)) if lesson.can_user_access(user)]
        )

    @action(detail=True, methods=['post'])
    def submit_answer(self, request, pk=None):
        try:
            with transaction.atomic():
                lesson = self.get_object()
                result = lesson.process_answer(request.user, request.data)
                return Response(result)
        except Exception as e:
            logger.error(f"Error processing answer: {e}")
            return Response(
                {"error": "Failed to process answer"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class FlashcardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Flashcard.objects.all()
    serializer_class = FlashcardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if not user.level:
            beginner_level = Level.objects.filter(difficulty="beginner").first()
            return Flashcard.objects.filter(lesson__level=beginner_level)

        accessible_lessons = Lesson.objects.filter(level=user.level).filter(
            pk__in=[lesson.pk for lesson in Lesson.objects.filter(level=user.level) if lesson.can_user_access(user)]
        )

        return Flashcard.objects.filter(lesson__in=accessible_lessons)

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
                    flashcard=flashcard,
                    defaults={'user_answer': answer, 'is_correct': is_correct}
                )

                # Update progress if not newly created
                if not created:
                    progress.user_answer = answer
                    progress.is_correct = is_correct
                    progress.save()

                # Update lesson progress if all flashcards are completed
                lesson_flashcards = Flashcard.objects.filter(lesson=flashcard.lesson)
                completed_flashcards = UserFlashcardProgress.objects.filter(
                    user=user,
                    flashcard__in=lesson_flashcards,
                    is_correct=True
                )

                if completed_flashcards.count() == lesson_flashcards.count():
                    UserProgress.objects.update_or_create(
                        user=user,
                        lesson=flashcard.lesson,
                        defaults={'completed': True, 'completed_at': timezone.now()}
                    )

            return Response({
                'is_correct': is_correct,
                'correct_answer': flashcard.word,
            })

        except Exception as e:
            logger.error(f"Flashcard answer check error: {e}")
            return Response({
                'error': 'An error occurred while processing your answer'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FlashcardSubmissionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, lesson_id):
        def fuzzy_match(user_answer, correct_answer, threshold=0.8):
            """
            Advanced fuzzy matching with optional typo tolerance and fill-in-the-blank support
            """
            import difflib
        
            user_answer = user_answer.lower().strip()
            correct_answer = correct_answer.lower().strip()
        
            similarity = difflib.SequenceMatcher(None, user_answer, correct_answer).ratio()
        
            if similarity < threshold:
                if user_answer in correct_answer or correct_answer in user_answer:
                    similarity = 0.9
        
            return similarity >= threshold

        try:
            lesson = Lesson.objects.get(id=lesson_id)
            flashcards = Flashcard.objects.filter(lesson=lesson)

            serializer = FlashcardSubmissionSerializer(
                data=request.data.get('answers'), 
                many=True
            )
            
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            total_correct = 0
            total_flashcards = flashcards.count()

            with transaction.atomic():
                for answer_data in serializer.validated_data:
                    flashcard = flashcards.get(id=answer_data['flashcard_id'])
                    
                    # Case-insensitive comparison with some flexibility
                    is_correct = (
                        answer_data['answer'].lower().strip() == 
                        flashcard.word.lower().strip()
                    )

                    # Advanced similarity check
                    if not is_correct:
                        is_correct = fuzzy_match(
                            answer_data['answer'], 
                            flashcard.word
                        )

                    UserFlashcardProgress.objects.update_or_create(
                        user=request.user,
                        flashcard=flashcard,
                        defaults={
                            'is_completed': is_correct,
                            'attempts': F('attempts') + 1,
                            'last_attempt': timezone.now(),
                            'points_earned': 10 if is_correct else 0
                        }
                    )

                    if is_correct:
                        total_correct += 1

                lesson_progress_percentage = (total_correct / total_flashcards) * 100
                
                UserProgress.objects.update_or_create(
                    user=request.user,
                    lesson=lesson,
                    defaults={
                        'completed': lesson_progress_percentage >= 80,
                        'score': lesson_progress_percentage,
                        'total_questions': total_flashcards,
                        'correct_answers': total_correct,
                        'completed_at': timezone.now() if lesson_progress_percentage >= 80 else None
                    }
                )

            return Response({
                'total_flashcards': total_flashcards,
                'correct_answers': total_correct,
                'progress_percentage': lesson_progress_percentage,
                'lesson_completed': lesson_progress_percentage >= 80
            })

        except Lesson.DoesNotExist:
            return Response(
                {'error': 'Lesson not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Flashcard submission error: {e}")
            return Response(
                {'error': 'An error occurred while processing flashcards'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        accessible_lessons = Lesson.objects.filter(level=user.level).filter(
            pk__in=[lesson.pk for lesson in Lesson.objects.filter(level=user.level) if lesson.can_user_access(user)]
        )

        return Quiz.objects.filter(lesson__in=accessible_lessons)

    @action(detail=True, methods=['POST'])
    def submit(self, request, pk=None):
        try:
            quiz = self.get_object()
            user = request.user

            # Validate submission
            answers = request.data.get('answers', [])
            total_questions = quiz.total_questions
            correct_answers = 0

            with transaction.atomic():
                # Check answers
                for answer_data in answers:
                    question = QuizQuestion.objects.get(id=answer_data['question_id'])
                    is_correct = answer_data['answer'].lower() == question.correct_answer.lower()

                    UserQuizProgress.objects.create(
                        user=user,
                        quiz=quiz,
                        question=question,
                        user_answer=answer_data['answer'],
                        is_correct=is_correct
                    )

                    if is_correct:
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

        current_level = user.level if user.level else Level.objects.order_by('level_order').first()
        return LevelTest.objects.filter(level=current_level)

    @action(detail=True, methods=['GET'])
    def questions(self, request, pk=None):
        level_test = self.get_object()
        questions = LevelTestQuestion.objects.filter(level_test=level_test).order_by('order')
        serializer = LevelTestQuestionSerializer(questions, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['POST'])
    def submit(self, request, pk=None):
        try:
            level_test = self.get_object()  # Get the level test
            user = request.user

            # Validate submission
            answers = request.data.get('answers', [])
            total_questions = level_test.questions.count()
            correct_answers = 0

            with transaction.atomic():
                # Check answers
                for answer_data in answers:
                    question = LevelTestQuestion.objects.get(id=answer_data['question_id'])
                    is_correct = answer_data['answer'].lower() == question.correct_answer.lower()

                    # Store progress for each question
                    UserLevelTestProgress.objects.create(
                        user=user,
                        level_test=level_test,
                        question=question,
                        user_answer=answer_data['answer'],
                        is_correct=is_correct
                    )

                    if is_correct:
                        correct_answers += 1

                # Calculate score
                score = (correct_answers / total_questions) * 100
                is_passed = score >= level_test.passing_score

                # Update UserLevelTestProgress
                level_test_progress, _ = UserLevelTestProgress.objects.get_or_create(
                    user=user,
                    level_test=level_test,
                    defaults={
                        'is_passed': is_passed,
                        'score': score,
                        'total_questions': total_questions
                    }
                )

                next_level = None
                if is_passed and level_test.level.level_order < 3:
                    # Fetch the next level based on level order
                    next_level = Level.objects.get(level_order=level_test.level.level_order + 1)
                    user.level = next_level
                    user.save()

                return Response({
                    'score': score,
                    'is_passed': is_passed,
                    'total_questions': total_questions,
                    'correct_answers': correct_answers,
                    'next_level': next_level.name if next_level else None,
                    'level_unlocked': next_level is not None
                })
        except Exception as e:
            logger.error(f"Level Test submission error: {e}")
            return Response({
                'error': 'An error occurred while submitting the level test'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class IntermediateLevelTestSubmissionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, level_id):
        try:
            level = Level.objects.get(id=level_id, difficulty='intermediate')
            level_test = LevelTest.objects.get(level=level)

            submitted_answers = request.data.get('answers', [])
            test_questions = LevelTestQuestion.objects.filter(level_test=level_test)

            total_questions = test_questions.count()
            correct_answers = 0

            with transaction.atomic():
                for question in test_questions:
                    answer_data = next((ans for ans in submitted_answers if ans.get('question_id') == question.id), None)

                    if not answer_data:
                        continue

                    is_correct = answer_data.get('answer', '').lower() == question.correct_answer.lower()

                    UserLevelTestProgress.objects.create(
                        user=request.user,
                        level_test=level_test,
                        question=question,
                        user_answer=answer_data.get('answer', ''),
                        is_correct=is_correct
                    )

                    if is_correct:
                        correct_answers += 1

                score = (correct_answers / total_questions) * 100
                is_passed = score >= level_test.passing_score

                if is_passed:
                    next_level = Level.objects.get(level_order=level.level_order + 1)
                    request.user.level = next_level
                    request.user.save()

            return Response({
                'total_questions': total_questions,
                'correct_answers': correct_answers,
                'score': score,
                'is_passed': is_passed,
                'next_level': next_level.name if is_passed else None
            })

        except Level.DoesNotExist:
            return Response({'error': 'Intermediate level not found'}, status=status.HTTP_404_NOT_FOUND)
        except LevelTest.DoesNotExist:
            return Response({'error': 'Level test not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Intermediate level test submission error: {e}")
            return Response({'error': 'An error occurred while processing the level test'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserProgressViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['GET'])
    def learning_progress(self, request):
        user = request.user

        completed_lessons = UserProgress.objects.filter(
            user=user, lesson__level=user.level, completed=True
        ).count()
        total_lessons = Lesson.objects.filter(level=user.level).count()

        passed_quizzes = UserQuizAttempt.objects.filter(
            user=user, quiz__lesson__level=user.level, is_passed=True
        ).count()
        total_quizzes = Quiz.objects.filter(lesson__level=user.level).count()

        completed_flashcards = UserFlashcardProgress.objects.filter(
            user=user, flashcard__lesson__level=user.level, is_completed=True
        ).count()
        total_flashcards = Flashcard.objects.filter(lesson__level=user.level).count()

        progress_data = {
            'level': user.level.id if user.level else None,
            'level_name': user.level.name if user.level else 'Beginner',
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
        """
        Provide advanced learning metrics
        """
        try:
            user = request.user

            metrics = {
                'learning_streak': UserProgress.get_learning_streak(user),
                'total_learning_time': UserProgress.get_total_learning_time(user)
            }

            serializer = UserLearningMetricsSerializer(data=metrics)
            serializer.is_valid(raise_exception=True)

            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Learning metrics error: {e}")
            return Response({
                'error': 'An error occurred while retrieving learning metrics'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

            report_data = {
                'overall_progress': self.learning_progress(request).data,
                'lessons': {
                    'completed': self.completed_lessons(request).data,
                    'recommended': self.recommended_lessons(request).data
                },
                'level_tests': {
                    'history': self.level_test_history(request).data,
                    'current_level': self.current_level_details(request).data
                },
                'performance_metrics': self.learning_metrics(request).data
            }

            serializer = ComprehensiveLearningReportSerializer(data=report_data)
            serializer.is_valid(raise_exception=True)

            return Response(report_data)

        except Exception as e:
            logger.error(f"Comprehensive learning report error: {e}")
            return Response({
                'error': 'An error occurred while generating learning report'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
