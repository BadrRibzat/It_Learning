from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from services.level_service import LevelService
from services.progress_service import ProgressService
from utils.exceptions import AppError
from .schemas import FlashcardAnswerSchema

lessons_ns = Namespace('lessons', description='Lessons and progress operations')

level_service = LevelService()
progress_service = ProgressService()

# Models for Swagger documentation
flashcard_answer_model = lessons_ns.model('FlashcardAnswer', {
    'flashcard_id': fields.String(required=True),
    'user_answer': fields.String(required=True),
    'expected_answer': fields.String(required=True)
})

@lessons_ns.route('/levels/progression')
class LevelProgression(Resource):
    @jwt_required()
    def get(self):
        """Get user's level progression"""
        user_id = get_jwt_identity()
        return level_service.get_level_progression(user_id)

@lessons_ns.route('/flashcards/<lesson_id>/submit')
class SubmitFlashcardAnswer(Resource):
    @jwt_required()
    @lessons_ns.expect(flashcard_answer_model)
    def post(self, lesson_id):
        """Submit a flashcard answer"""
        user_id = get_jwt_identity()
        data = lessons_ns.payload

        try:
          schema = FlashcardAnswerSchema(**data)
        except Exception as e:
           raise AppError(f"Validation error: {e}", 400)

        is_correct = schema.user_answer.strip().lower() == schema.expected_answer.lower()
        progress_service.track_flashcard_progress(
            user_id=user_id,
            lesson_id=lesson_id,
            flashcard_id=schema.flashcard_id,
            is_correct=is_correct
        )
        
        progress = progress_service.get_lesson_progress(user_id, lesson_id)
        return {
            'correct': is_correct,
            'progress': progress,
            'quiz_unlocked': progress['quiz_unlocked']
        }, 200
