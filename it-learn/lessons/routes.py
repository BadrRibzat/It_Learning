from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from services.progress_service import ProgressService
from services.level_service import LevelService
from utils.exceptions import AppError
from utils.db import get_db
import logging

logger = logging.getLogger(__name__)

lessons_ns = Namespace('lessons', description='Lesson management and progress tracking')

# API Models
flashcard_model = lessons_ns.model('Flashcard', {
    'id': fields.String(required=True, description='Unique identifier for the flashcard'),
    'command': fields.String(required=True, description='Command name or syntax'),
    'explanation': fields.String(description='Detailed explanation of the command'),
    'example': fields.String(description='Practical usage example'),
    'question': fields.String(description='Practice question about the command'),
    'answer': fields.String(description='Correct answer for the question'),
    'order': fields.Integer(description='Display order within lesson')
})

quiz_model = lessons_ns.model('Quiz', {
    'id': fields.String(required=True, description='Quiz identifier'),
    'questions': fields.List(fields.String, description='List of quiz questions'),
    'total_questions': fields.Integer(description='Total number of questions in the quiz'),
    'passing_score': fields.Float(description='Passing score required (0.0-1.0)')
})

level_card_model = lessons_ns.model('LevelCard', {
    'id': fields.String(required=True, description='Unique identifier for the level'),
    'name': fields.String(required=True, description='Name of the level'),
    'description': fields.String(description='Description of the level'),
    'lessons': fields.List(fields.Raw, description='List of lessons in the level')
})

lesson_model = lessons_ns.model('Lesson', {
    'id': fields.String(required=True, description='Unique identifier for the lesson'),
    'title': fields.String(required=True, description='Title of the lesson'),
    'description': fields.String(description='Description of the lesson')
})

@lessons_ns.route('/levels')
class LevelsList(Resource):
    @jwt_required()
    @lessons_ns.doc(
        description="Fetch all available levels with their associated lessons.",
        responses={
            200: "Levels fetched successfully",
            401: "Authentication required",
            500: "Server error"
        }
    )
    @lessons_ns.marshal_with(level_card_model, as_list=True)
    def get(self):
        """Get all levels with their associated lessons."""
        try:
            level_service = LevelService()
            levels = level_service.get_levels()

            # Ensure levels are returned as a list
            return [{
                'id': str(level['_id']),
                'name': level['name'],
                'description': level.get('description', ''),
                'lessons': [{
                    'id': str(lesson['_id']),
                    'title': lesson['title'],
                    'description': lesson.get('description', '')
                } for lesson in level.get('lessons', [])]
            } for level in levels], 200

        except Exception as e:
            logger.error(f"Error fetching levels: {str(e)}")
            raise AppError("Failed to fetch levels", 500)

@lessons_ns.route('/levels/<level_id>/lessons')
class LessonsByLevel(Resource):
    @jwt_required()
    @lessons_ns.doc(
        description="Fetch all lessons for a specific level.",
        params={'level_id': 'ID of the level'},
        responses={
            200: "Lessons fetched successfully",
            401: "Authentication required",
            404: "Level not found",
            500: "Server error"
        }
    )
    @lessons_ns.marshal_with(lesson_model, as_list=True)
    def get(self, level_id):
        """Get lessons for a specific level."""
        try:
            if not ObjectId.is_valid(level_id):
                raise AppError("Invalid level ID format", 400)

            level_service = LevelService()
            lessons = level_service.get_lessons_by_level(level_id)

            return [{
                'id': str(lesson['_id']),
                'title': lesson['title'],
                'description': lesson.get('description', '')
            } for lesson in lessons], 200

        except AppError as e:
            raise e
        except Exception as e:
            logger.error(f"Error fetching lessons: {str(e)}")
            raise AppError("Failed to fetch lessons", 500)

@lessons_ns.route('/lessons/<lesson_id>/flashcards')
class LessonFlashcards(Resource):
    @jwt_required()
    @lessons_ns.doc(
        description="Fetch all flashcards for a specific lesson.",
        params={'lesson_id': 'ID of the lesson'},
        responses={
            200: "Flashcards fetched successfully",
            401: "Authentication required",
            404: "Lesson not found",
            500: "Server error"
        }
    )
    @lessons_ns.marshal_with(flashcard_model, as_list=True)
    def get(self, lesson_id):
        """Get flashcards for a specific lesson."""
        try:
            if not ObjectId.is_valid(lesson_id):
                raise AppError("Invalid lesson ID format", 400)

            db = get_db()
            flashcards = list(db.flashcards.find({'lesson': ObjectId(lesson_id)}).sort('order', 1))

            if not flashcards:
                raise AppError("No flashcards found for this lesson", 404)

            return [{
                'id': str(f['_id']),
                'command': f['command'],
                'explanation': f['explanation'],
                'example': f['example'],
                'question': f['question'],
                'answer': f['answer'],
                'order': f['order']
            } for f in flashcards], 200

        except AppError as e:
            raise e
        except Exception as e:
            logger.error(f"Error fetching flashcards: {str(e)}")
            raise AppError("Failed to fetch flashcards", 500)

@lessons_ns.route('/lessons/<lesson_id>/quiz')
class LessonQuiz(Resource):
    @jwt_required()
    @lessons_ns.doc(
        description="Fetch quiz questions for a specific lesson.",
        params={'lesson_id': 'ID of the lesson'},
        responses={
            200: "Quiz fetched successfully",
            401: "Authentication required",
            404: "Quiz not found",
            500: "Server error"
        }
    )
    @lessons_ns.marshal_with(quiz_model)
    def get(self, lesson_id):
        """Get quiz questions for a specific lesson."""
        try:
            if not ObjectId.is_valid(lesson_id):
                raise AppError("Invalid lesson ID format", 400)

            db = get_db()
            quiz = db.quizzes.find_one({'lesson': ObjectId(lesson_id)})

            if not quiz:
                raise AppError("Quiz not found for this lesson", 404)

            questions = list(db.questions.find({'quiz': quiz['_id']}).sort('order', 1))
            return {
                'id': str(quiz['_id']),
                'questions': [q['question'] for q in questions],
                'total_questions': len(questions),
                'passing_score': quiz.get('passing_score', 0.8)
            }, 200

        except AppError as e:
            raise e
        except Exception as e:
            logger.error(f"Error fetching quiz: {str(e)}")
            raise AppError("Failed to fetch quiz", 500)
