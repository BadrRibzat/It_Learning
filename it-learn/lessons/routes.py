from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime, timedelta, UTC
from services.level_service import LevelService
from services.progress_service import ProgressService
from utils.exceptions import AppError
from utils.db import get_db
from .schemas import FlashcardAnswerSchema
import logging

logger = logging.getLogger(__name__)

lessons_ns = Namespace(
    'lessons', 
    description='''Interactive learning system for Linux/MacOS command mastery.
    
    Features:
    - Level-based progression system
    - Interactive flashcards with real command examples
    - Progress tracking and scoring
    - Quiz-based knowledge verification
    - Level advancement tests
    
    Endpoints are organized by:
    1. Lessons management (/levels/{level_id}/lessons)
    2. Flashcard interaction (/lessons/{lesson_id}/flashcards)
    3. Quiz system (/lessons/{lesson_id}/quiz)
    4. Level tests (/levels/{level_id}/test)
    5. Progress tracking (/progress/{level_id})
    
    All endpoints require JWT authentication.
    '''
)

# Initialize services
level_service = LevelService()
progress_service = ProgressService()
db = get_db()

# API Models
flashcard_model = lessons_ns.model('Flashcard', {
    'id': fields.String(required=True, description='Unique identifier for the flashcard'),
    'command': fields.String(required=True, description='Command name or syntax', example='ls'),
    'explanation': fields.String(description='Detailed explanation of the command', example='List directory contents'),
    'example': fields.String(description='Practical usage example', example='ls -la /home'),
    'formatted_example': fields.String(description='Example with syntax highlighting'),
    'question': fields.String(description='Practice question about the command'),
    'answer': fields.String(description='Correct answer for the question'),
    'order': fields.Integer(description='Display order within lesson', example=1)
})

lesson_model = lessons_ns.model('Lesson', {
    'id': fields.String(required=True, description='Unique lesson identifier'),
    'title': fields.String(required=True, description='Lesson title', example='Basic File Operations'),
    'description': fields.String(description='Lesson overview and objectives'),
    'order': fields.Integer(required=True, description='Lesson sequence number', example=1),
    'completed': fields.Boolean(description='Lesson completion status'),
    'progress': fields.Raw(description='Detailed progress statistics', 
                         example={'completed_flashcards': 8, 'total_flashcards': 10})
})

question_model = lessons_ns.model('Question', {
    'id': fields.String(description='Question identifier'),
    'type': fields.String(default='fill_blank', description='Question type (fill_blank, multiple_choice)'),
    'question': fields.String(description='Question text', example='What command shows directory contents?'),
    'answer': fields.String(description='Correct answer', example='ls'),
    'order': fields.Integer(description='Question sequence number')
})

quiz_model = lessons_ns.model('Quiz', {
    'id': fields.String(description='Quiz identifier'),
    'lesson_id': fields.String(description='Associated lesson ID'),
    'questions': fields.List(fields.Nested(question_model)),
    'total_questions': fields.Integer(default=5, description='Number of questions'),
    'passing_score': fields.Float(default=0.8, description='Required score to pass (0.0-1.0)')
})

quiz_submission_model = lessons_ns.model('QuizSubmission', {
    'answers': fields.List(fields.String, required=True, description='Ordered list of user\'s answers')
})

quiz_submission_response = lessons_ns.model('QuizSubmissionResponse', {
    'score': fields.Float(description='Score as percentage', example=80.0),
    'correct_answers': fields.Integer(description='Number of correct answers', example=4),
    'total_questions': fields.Integer(description='Total questions in quiz', example=5),
    'passed': fields.Boolean(description='Whether passing score was achieved'),
    'next_lesson_unlocked': fields.Boolean(description='Whether next lesson is available'),
    'points_earned': fields.Integer(description='Points earned for this attempt', example=100)
})

flashcard_answer_model = lessons_ns.model('FlashcardAnswer', {
    'flashcard_id': fields.String(required=True, description='Flashcard identifier'),
    'user_answer': fields.String(required=True, description='User\'s submitted answer'),
    'expected_answer': fields.String(required=True, description='Correct answer')
})

level_test_model = lessons_ns.model('LevelTest', {
    'id': fields.String(description='Test identifier'),
    'level': fields.String(description='Level identifier'),
    'questions': fields.List(fields.Nested(question_model)),
    'total_questions': fields.Integer(default=10, description='Number of test questions'),
    'passing_score': fields.Float(default=0.8, description='Required passing score'),
    'attempt_info': fields.Raw(description='Attempt limit information')
})

test_submission_model = lessons_ns.model('TestSubmission', {
    'answers': fields.List(fields.String, required=True, description='Ordered list of answers')
})

level_progress_response = lessons_ns.model('LevelProgressResponse', {
    'current_level': fields.String(description='Current level name', example='Beginner'),
    'completed_lessons': fields.Integer(description='Completed lesson count', example=3),
    'total_lessons': fields.Integer(description='Total lessons in level', example=5),
    'lessons_progress': fields.List(fields.Raw(description='Individual lesson progress')),
    'quiz_scores': fields.List(fields.Integer(description='Previous quiz scores')),
    'level_test_available': fields.Boolean(description='Level test availability'),
    'next_level_unlocked': fields.Boolean(description='Next level status'),
    'total_points': fields.Integer(description='Total points earned in level')
})

@lessons_ns.route('/levels')
class LevelList(Resource):
    @jwt_required()
    @lessons_ns.doc(
        description='Get all available levels',
        security='Bearer Auth',
        responses={
            200: 'List of available levels',
            401: 'Authentication required',
            500: 'Server error'
        }
    )
    def get(self):
        """Get all available levels"""
        try:
            user_id = get_jwt_identity()
            user = db.users.find_one({'_id': ObjectId(user_id)})

            # Get all levels
            levels = list(db.levels.find().sort('order', 1))

            # Format response
            response = []
            for level in levels:
                is_unlocked = (
                    level['name'] == 'beginner' or
                    str(level['_id']) in [str(lid) for lid in user.get('unlocked_levels', [])]
                )
                response.append({
                    'id': str(level['_id']),
                    'name': level['name'],
                    'order': level['order'],
                    'is_unlocked': is_unlocked,
                    'is_current': user.get('current_level') == level['order']
                })

            return response
        except Exception as e:
            logger.error(f"Error fetching levels: {str(e)}")
            raise AppError("Failed to fetch levels", 500)

@lessons_ns.route('/levels/current')
class CurrentLevel(Resource):
    @jwt_required()
    @lessons_ns.doc(
        description='Get user\'s current level details',
        security='Bearer Auth',
        responses={
            200: 'Current level details',
            401: 'Authentication required',
            404: 'Level not found',
            500: 'Server error'
        }
    )
    def get(self):
        """Get current level details"""
        try:
            user_id = get_jwt_identity()
            user = db.users.find_one({'_id': ObjectId(user_id)})

            # New users start at beginner level
            current_level_order = user.get('current_level', 1)
            level = db.levels.find_one({'order': current_level_order})

            if not level:
                level = db.levels.find_one({'name': 'beginner'})

            if not level:
                raise AppError("Level not found", 404)

            # Get lessons for current level
            lessons = list(db.lessons.find({
                'level': level['_id']
            }).sort('order', 1))

            return {
                'id': str(level['_id']),
                'name': level['name'],
                'order': level['order'],
                'total_lessons': len(lessons),
                'lessons': [{
                    'id': str(lesson['_id']),
                    'title': lesson['title'],
                    'order': lesson['order']
                } for lesson in lessons]
            }
        except AppError as e:
            raise e
        except Exception as e:
            logger.error(f"Error fetching current level: {str(e)}")
            raise AppError("Failed to fetch current level", 500)

@lessons_ns.route('/levels/<level_id>/lessons')
class LessonsList(Resource):
    @jwt_required()
    @lessons_ns.marshal_list_with(lesson_model)
    @lessons_ns.doc(
        description='''Get all lessons for a specific level with progress tracking.
        
        Returns a list of lessons with their completion status and progress statistics.
        Lessons are ordered by their sequence number.
        ''',
        params={'level_id': 'Level identifier'},
        security='Bearer Auth',
        responses={
            200: 'List of lessons successfully retrieved',
            401: 'Authentication required',
            404: 'Level not found',
            500: 'Server error'
        }
    )
    def get(self, level_id):
        """Get all lessons for a level with progress tracking"""
        try:
            user_id = get_jwt_identity()
            if not ObjectId.is_valid(level_id):
                raise AppError("Invalid level ID format", 400)
            level = db.levels.find_one({'_id': ObjectId(level_id)})
            if not level:
                raise AppError("Level not found", 404)

            lessons = list(db.lessons.find(
                {'level': ObjectId(level_id)}
            ).sort('order', 1))

            return [self._format_lesson(lesson, user_id) for lesson in lessons]
        except Exception as e:
            logger.error(f"Error fetching lessons: {str(e)}")
            raise AppError("Failed to fetch lessons", 500)

    def _format_lesson(self, lesson, user_id):
        progress = progress_service.get_lesson_progress(user_id, str(lesson['_id']))
        return {
            'id': str(lesson['_id']),
            'title': lesson['title'],
            'description': lesson.get('description', ''),
            'order': lesson['order'],
            'completed': progress['completed_flashcards'] >= 10,
            'progress': progress
        }

@lessons_ns.route('/lessons/<lesson_id>/flashcards')
class LessonFlashcards(Resource):
    @jwt_required()
    @lessons_ns.marshal_list_with(flashcard_model)
    @lessons_ns.doc(
        description='''Get all flashcards for a specific lesson.
        
        Returns an ordered list of flashcards containing:
        - Command information
        - Examples
        - Practice questions
        - Proper formatting
        ''',
        params={'lesson_id': 'Lesson identifier'},
        security='Bearer Auth',
        responses={
            200: 'List of flashcards successfully retrieved',
            401: 'Authentication required',
            404: 'Lesson not found',
            500: 'Server error'
        }
    )
    def get(self, lesson_id):
        """Retrieve flashcards for interactive learning"""
        try:
            if not ObjectId.is_valid(lesson_id):
                raise AppError("Invalid lesson ID format", 400)
            lesson = db.lessons.find_one({'_id': ObjectId(lesson_id)})
            if not lesson:
                raise AppError("Lesson not found", 404)

            flashcards = list(db.flashcards.find(
                {'lesson': ObjectId(lesson_id)}
            ).sort('order', 1))
            
            return [self._format_flashcard(f) for f in flashcards]
        except Exception as e:
            logger.error(f"Error fetching flashcards: {str(e)}")
            raise AppError("Failed to fetch flashcards", 500)

    def _format_flashcard(self, flashcard):
        return {
            'id': str(flashcard['_id']),
            'command': flashcard['command'],
            'explanation': flashcard['explanation'],
            'example': flashcard['example'],
            'formatted_example': flashcard.get('formatted_example', flashcard['example']),
            'question': flashcard['question'],
            'answer': flashcard['answer'],
            'order': flashcard['order']
        }

@lessons_ns.route('/flashcards/<lesson_id>/submit')
class SubmitFlashcardAnswer(Resource):
    @jwt_required()
    @lessons_ns.expect(flashcard_answer_model)
    @lessons_ns.doc(
        description='''Submit an answer for a flashcard.
        
        Validates the user's answer and returns:
        - Correctness status
        - Updated progress
        - Points earned
        - Quiz unlock status
        ''',
        params={'lesson_id': 'Lesson identifier'},
        security='Bearer Auth',
        responses={
            200: 'Answer processed successfully',
            400: 'Invalid submission format',
            401: 'Authentication required',
            404: 'Flashcard not found',
            500: 'Server error'
        }
    )
    def post(self, lesson_id):
        """Submit and validate flashcard answer"""
        try:
            user_id = get_jwt_identity()
            data = lessons_ns.payload
            if not ObjectId.is_valid(lesson_id) or not ObjectId.is_valid(data['flashcard_id']):
                raise AppError("Invalid ID format", 400)

            flashcard = db.flashcards.find_one({
                '_id': ObjectId(data['flashcard_id']),
                'lesson': ObjectId(lesson_id)
            })
            
            if not flashcard:
                raise AppError("Flashcard not found", 404)

            is_correct = data['user_answer'].strip().lower() == flashcard['answer'].lower()
            
            progress_service.track_flashcard_progress(
                user_id=user_id,
                lesson_id=lesson_id,
                flashcard_id=str(flashcard['_id']),
                is_correct=is_correct
            )
            
            progress = progress_service.get_lesson_progress(user_id, lesson_id)
            
            return {
                'correct': is_correct,
                'progress': progress,
                'quiz_unlocked': progress['quiz_unlocked'],
                'points_earned': 10 if is_correct else 0
            }
            
        except AppError as e:
            raise e
        except Exception as e:
            logger.error(f"Error processing submission: {str(e)}")
            raise AppError("Failed to process submission", 500)

@lessons_ns.route('/lessons/<lesson_id>/quiz')
class LessonQuiz(Resource):
    @jwt_required()
    @lessons_ns.marshal_with(quiz_model)
    @lessons_ns.doc(
        description='''Get quiz questions for a lesson.
        
        Returns quiz details if:
        - User has completed sufficient flashcards
        - Quiz is unlocked based on progress
        - User has not already passed the quiz
        
        Returns questions in randomized order.
        ''',
        params={'lesson_id': 'Lesson identifier'},
        security='Bearer Auth',
        responses={
            200: 'Quiz details successfully retrieved',
            401: 'Authentication required',
            403: 'Quiz not unlocked',
            404: 'Quiz not found',
            500: 'Server error'
        }
    )
    def get(self, lesson_id):
        """Retrieve quiz questions if unlocked"""
        try:
            user_id = get_jwt_identity()
            
            # Check if quiz is unlocked
            progress = progress_service.get_lesson_progress(user_id, lesson_id)
            if not progress.get('quiz_unlocked', False):
                raise AppError("Complete more flashcards to unlock quiz", 403)
            
            # Get quiz and its questions
            if not ObjectId.is_valid(lesson_id):
                 raise AppError("Invalid lesson ID format", 400)
            quiz = db.quizzes.find_one({'lesson': ObjectId(lesson_id)})
            if not quiz:
                 raise AppError("Quiz not found", 404)
            
            # Get questions
            questions = list(db.questions.find(
                {'quiz': quiz['_id']}
            ).sort('order', 1))
            
            # Format response
            return {
                'id': str(quiz['_id']),
                'lesson_id': lesson_id,
                'questions': [{
                    'id': str(q['_id']),
                    'type': q['type'],
                    'question': q['question'],
                    'order': q['order']
                } for q in questions],
                'total_questions': len(questions),
                'passing_score': quiz.get('passing_score', 0.8)
            }
            
        except AppError as e:
            raise e
        except Exception as e:
            logger.error(f"Error fetching quiz: {str(e)}")
            raise AppError("Failed to fetch quiz", 500)

    @jwt_required()
    @lessons_ns.expect(quiz_submission_model)
    @lessons_ns.marshal_with(quiz_submission_response)
    @lessons_ns.doc(
        description='''Submit quiz answers for grading.
        
        Processes quiz submission and:
        - Calculates score
        - Updates progress
        - Awards points
        - Unlocks next lesson if passed
        
        Required score is 80% to pass.
        ''',
        params={'lesson_id': 'Lesson identifier'},
        security='Bearer Auth',
        responses={
            200: 'Quiz submission processed successfully',
            400: 'Invalid submission format',
            401: 'Authentication required',
            404: 'Quiz not found',
            500: 'Server error'
        }
    )
    def post(self, lesson_id):
        """Submit and grade quiz answers"""
        try:
            user_id = get_jwt_identity()
            data = lessons_ns.payload
            if not ObjectId.is_valid(lesson_id):
                raise AppError("Invalid lesson ID format", 400)
            
            quiz = db.quizzes.find_one({'lesson': ObjectId(lesson_id)})
            if not quiz:
                raise AppError("Quiz not found", 404)
            
            questions = list(db.questions.find(
                {'quiz': quiz['_id']}
            ).sort('order', 1))
            
            if len(data['answers']) != len(questions):
                raise AppError("Invalid number of answers", 400)
            
            correct_answers = sum(
                1 for q, a in zip(questions, data['answers'])
                if a.strip().lower() == q['answer'].lower()
            )
            
            score = correct_answers / len(questions)
            passed = score >= 0.8
            points_earned = correct_answers * 20
            
            # Record submission
            submission = {
                'user': ObjectId(user_id),
                'quiz': quiz['_id'],
                'answers': data['answers'],
                'score': score,
                'correct_answers': correct_answers,
                'passed': passed,
                'points_earned': points_earned,
                'submitted_at': datetime.now(UTC)
            }
            db.quiz_submissions.insert_one(submission)
            
            # Handle next lesson unlock if passed
            next_lesson_unlocked = False
            if passed:
                current_lesson = db.lessons.find_one({'_id': ObjectId(lesson_id)})
                next_lesson = db.lessons.find_one({
                    'level': current_lesson['level'],
                    'order': current_lesson['order'] + 1
                })
                if next_lesson:
                    db.users.update_one(
                        {'_id': ObjectId(user_id)},
                        {
                            '$addToSet': {'unlocked_lessons': next_lesson['_id']},
                            '$inc': {'total_points': points_earned}
                        }
                    )
                    next_lesson_unlocked = True
            
            return {
                'score': score * 100,
                'correct_answers': correct_answers,
                'total_questions': len(questions),
                'passed': passed,
                'next_lesson_unlocked': next_lesson_unlocked,
                'points_earned': points_earned
            }
            
        except AppError as e:
            raise e
        except Exception as e:
            logger.error(f"Quiz submission error: {str(e)}")
            raise AppError("Failed to process quiz submission", 500)

@lessons_ns.route('/levels/<level_id>/test')
class LevelTest(Resource):
    @jwt_required()
    @lessons_ns.marshal_with(level_test_model)
    @lessons_ns.doc(
        description='''Get level advancement test.
        
        Returns test details if:
        - All lessons in level are completed
        - All quizzes are passed
        - Not in cooldown period from previous attempt
        
        Test has stricter requirements than regular quizzes.
        ''',
        params={'level_id': 'Level identifier'},
        security='Bearer Auth',
        responses={
            200: 'Level test retrieved successfully',
            401: 'Authentication required',
            403: 'Not eligible for test',
            404: 'Test not found',
            500: 'Server error'
        }
    )
    def get(self, level_id):
        """Retrieve level advancement test if eligible"""
        try:
            user_id = get_jwt_identity()
            if not ObjectId.is_valid(level_id):
                raise AppError("Invalid level ID format", 400)
            
            self._verify_level_eligibility(user_id, level_id)
            
            level_test = db.level_tests.find_one({'level': ObjectId(level_id)})
            if not level_test:
                raise AppError("Level test not found", 404)

            attempt_info = self._check_attempt_limits(user_id, level_test['_id'])
            if not attempt_info['can_attempt']:
                raise AppError(
                    f"Must wait until {attempt_info['next_attempt_available']} for next attempt",
                    403
                )

            questions = list(db.level_test_questions.find(
                {'level_test': level_test['_id']}
            ).sort('order', 1))

            return {
                'id': str(level_test['_id']),
                'level': str(level_test['level']),
                'questions': [{
                    'id': str(q['_id']),
                    'type': q['type'],
                    'question': q['question'],
                    'order': q['order']
                } for q in questions],
                'total_questions': len(questions),
                'passing_score': level_test['passing_score'],
                'attempt_info': attempt_info
            }

        except AppError as e:
            raise e
        except Exception as e:
            logger.error(f"Error fetching level test: {str(e)}")
            raise AppError("Failed to fetch level test", 500)

    @jwt_required()
    @lessons_ns.expect(test_submission_model)
    @lessons_ns.doc(
        description='''Submit level test answers.
        
        Processes test submission and:
        - Validates eligibility
        - Checks attempt limits
        - Calculates score
        - Handles level progression
        - Awards points
        
        Has cooldown period between attempts.
        ''',
        params={'level_id': 'Level identifier'},
        security='Bearer Auth',
        responses={
            200: 'Test submission processed successfully',
            400: 'Invalid submission',
            401: 'Authentication required',
            403: 'Not eligible or on cooldown',
            404: 'Test not found',
            500: 'Server error'
        }
    )
    def post(self, level_id):
        """Submit and grade level advancement test"""
        try:
            user_id = get_jwt_identity()
            data = lessons_ns.payload
            if not ObjectId.is_valid(level_id):
                raise AppError("Invalid level ID format", 400)

            self._verify_level_eligibility(user_id, level_id)
            level_test = db.level_tests.find_one({'level': ObjectId(level_id)})
            if not level_test:
                raise AppError("Level test not found", 404)

            attempt_info = self._check_attempt_limits(user_id, level_test['_id'])
            if not attempt_info['can_attempt']:
                raise AppError(
                    f"Must wait until {attempt_info['next_attempt_available']} for next attempt",
                    403
                )

            questions = list(db.level_test_questions.find(
                {'level_test': level_test['_id']}
            ).sort('order', 1))

            if len(data['answers']) != len(questions):
                raise AppError("Invalid number of answers", 400)

            correct_answers = sum(
                1 for q, a in zip(questions, data['answers'])
                if a.strip().lower() == q['answer'].lower()
            )

            score = correct_answers / len(questions)
            passed = score >= 0.8
            points_earned = correct_answers * 50

            submission = {
                'user': ObjectId(user_id),
                'level_test': level_test['_id'],
                'answers': data['answers'],
                'score': score,
                'correct_answers': correct_answers,
                'passed': passed,
                'points_earned': points_earned,
                'attempt_number': attempt_info['attempts_made'] + 1,
                'submitted_at': datetime.now(UTC)
            }
            db.level_test_submissions.insert_one(submission)

            next_level_unlocked = False
            if passed:
                current_level = db.levels.find_one({'_id': ObjectId(level_id)})
                next_level = db.levels.find_one({'order': current_level['order'] + 1})
                if next_level:
                    db.users.update_one(
                        {'_id': ObjectId(user_id)},
                        {
                            '$addToSet': {'unlocked_levels': next_level['_id']},
                            '$set': {'current_level': next_level['order']},
                            '$inc': {
                                'total_points': points_earned,
                                'level_progress': 100
                            }
                        }
                    )
                    next_level_unlocked = True

            next_attempt_at = None
            if not passed and attempt_info['attempts_made'] < 3:
                next_attempt_at = datetime.now(UTC) + timedelta(hours=24)

            return {
                'score': score * 100,
                'correct_answers': correct_answers,
                'total_questions': len(questions),
                'passed': passed,
                'next_level_unlocked': next_level_unlocked,
                'required_score': 80,
                'can_retry': not passed and attempt_info['attempts_made'] < 3,
                'retry_available_at': next_attempt_at,
                'points_earned': points_earned
            }

        except AppError as e:
            raise e
        except Exception as e:
            logger.error(f"Test submission error: {str(e)}")
            raise AppError("Failed to process test submission", 500)

    def _verify_level_eligibility(self, user_id: str, level_id: str):
        """Verify user has completed all lessons in the level"""
        if not ObjectId.is_valid(level_id):
             raise AppError("Invalid level ID format", 400)
        lessons = list(db.lessons.find({'level': ObjectId(level_id)}))

        for lesson in lessons:
            progress = progress_service.get_lesson_progress(user_id, str(lesson['_id']))
            if not progress['completed_flashcards'] >= 10:
                raise AppError(
                    "Must complete all lessons before taking level test",
                    403
                )

            quiz = db.quizzes.find_one({'lesson': lesson['_id']})
            if quiz:
                submission = db.quiz_submissions.find_one({
                    'user': ObjectId(user_id),
                    'quiz': quiz['_id'],
                    'passed': True
                })
                if not submission:
                    raise AppError(
                        "Must pass all lesson quizzes before taking level test",
                        403
                    )

    def _check_attempt_limits(self, user_id: str, test_id: ObjectId):
        """Check test attempt limits and cooldown period"""
        submissions = list(db.level_test_submissions.find({
            'user': ObjectId(user_id),
            'level_test': test_id
        }).sort('submitted_at', -1))

        attempts_made = len(submissions)
        last_attempt = submissions[0]['submitted_at'] if submissions else None

        if any(sub['passed'] for sub in submissions):
            return {
                'can_attempt': False,
                'attempts_made': attempts_made,
                'max_attempts': 3,
                'last_attempt': last_attempt,
                'next_attempt_available': None,
                'reason': "Already passed this test"
            }

        if attempts_made >= 3:
            return {
                'can_attempt': False,
                'attempts_made': attempts_made,
                'max_attempts': 3,
                'last_attempt': last_attempt,
                'next_attempt_available': None,
                'reason': "Maximum attempts reached"
            }

        if last_attempt:
            cooldown_end = last_attempt + timedelta(hours=24)
            if datetime.now(UTC) < cooldown_end:
                return {
                    'can_attempt': False,
                    'attempts_made': attempts_made,
                    'max_attempts': 3,
                    'last_attempt': last_attempt,
                    'next_attempt_available': cooldown_end,
                    'reason': "Cooldown period active"
                }

        return {
            'can_attempt': True,
            'attempts_made': attempts_made,
            'max_attempts': 3,
            'last_attempt': last_attempt,
            'next_attempt_available': None
        }

@lessons_ns.route('/progress/<level_id>')
class LevelProgress(Resource):
    @jwt_required()
    @lessons_ns.marshal_with(level_progress_response)
    @lessons_ns.doc(
        description='''Get comprehensive level progress data.
        
        Returns:
        - Lesson completion status
        - Quiz scores
        - Points earned
        - Level test availability
        - Overall progress statistics
        ''',
        params={'level_id': 'Level identifier'},
        security='Bearer Auth',
        responses={
            200: 'Progress data retrieved successfully',
            401: 'Authentication required',
            404: 'Level not found',
            500: 'Server error'
        }
    )
    def get(self, level_id):
        """Get comprehensive progress data for a level"""
        try:
            user_id = get_jwt_identity()
            if not ObjectId.is_valid(level_id):
               raise AppError("Invalid level ID format", 400)
            
            level = db.levels.find_one({'_id': ObjectId(level_id)})
            if not level:
                raise AppError("Level not found", 404)

            lessons = list(db.lessons.find({'level': level['_id']}).sort('order', 1))
            lessons_progress = []
            total_points = 0

            for lesson in lessons:
                progress = progress_service.get_lesson_progress(user_id, str(lesson['_id']))
                lessons_progress.append(progress)
                flashcard_points = progress.get('correct_answers', 0) * 10
                total_points += flashcard_points

            # Get quiz scores and points
            quiz_scores = []
            for lesson in lessons:
                quiz = db.quizzes.find_one({'lesson': lesson['_id']})
                if quiz:
                    submission = db.quiz_submissions.find_one(
                        {
                            'user': ObjectId(user_id), 
                            'quiz': quiz['_id']
                        },
                        sort=[('submitted_at', -1)]
                    )
                    if submission:
                        quiz_scores.append(int(submission['score'] * 100))
                        total_points += submission.get('points_earned', 0)

            # Calculate completion status
            completed_lessons = sum(1 for p in lessons_progress if p['completed_flashcards'] >= 10)
            all_quizzes_passed = all(
                db.quiz_submissions.find_one({
                    'user': ObjectId(user_id),
                    'quiz': db.quizzes.find_one({'lesson': lesson['_id']})['_id'],
                    'passed': True
                }) 
                for lesson in lessons 
                if db.quizzes.find_one({'lesson': lesson['_id']})
            )

            # Check level test availability
            level_test_available = (completed_lessons == len(lessons) and 
                                  all_quizzes_passed)

            # Check if next level is unlocked
            user = db.users.find_one({'_id': ObjectId(user_id)})
            next_level = db.levels.find_one({'order': level['order'] + 1})
            next_level_unlocked = (next_level and 
                                 str(next_level['_id']) in 
                                 [str(level_id) for level_id in user.get('unlocked_levels', [])])

            return {
                'current_level': level['name'],
                'completed_lessons': completed_lessons,
                'total_lessons': len(lessons),
                'lessons_progress': lessons_progress,
                'quiz_scores': quiz_scores,
                'level_test_available': level_test_available,
                'next_level_unlocked': next_level_unlocked,
                'total_points': total_points
            }

        except AppError as e:
            raise e
        except Exception as e:
            logger.error(f"Level progress error: {str(e)}")
            raise AppError("Failed to fetch level progress", 500)
