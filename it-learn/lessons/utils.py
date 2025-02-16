from bson import ObjectId
import random
from utils.db import get_db

def generate_quiz_questions(lesson_id: str, num_questions: int = 5) -> list:
    """Generate quiz questions from lesson flashcards."""
    db = get_db()
    flashcards = list(db.flashcards.find({'lesson': ObjectId(lesson_id)}))
    return random.sample(flashcards, min(num_questions, len(flashcards)))

def calculate_lesson_progress(user_id: str, lesson_id: str) -> Optional[int]:
    """Calculate the progress of a user in a specific lesson."""
    db = get_db()
    progress = db.lessons_progress.find_one({
        'user': ObjectId(user_id),
        'lesson': ObjectId(lesson_id)
    })
    return progress['last_completed_flashcard'] if progress else None
