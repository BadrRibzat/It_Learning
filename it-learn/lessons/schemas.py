from pydantic import BaseModel, Field
from typing import List, Optional

class QuizSubmissionSchema(BaseModel):
    quiz_id: str = Field(..., description="ID of the quiz")
    answers: List[str] = Field(..., description="List of user's answers")

class LevelTestSubmissionSchema(BaseModel):
    level_test_id: str = Field(..., description="ID of the level test")
    answers: List[str] = Field(..., description="List of user's answers")

class FlashcardAnswerSchema(BaseModel):
    flashcard_id: str = Field(..., description="ID of the flashcard")
    user_answer: str = Field(..., description="User's answer")
    expected_answer: str = Field(..., description="Expected answer")

class QuizAnswerSchema(BaseModel):
    quiz_id: str = Field(..., description="ID of the quiz")
    answers: List[str] = Field(..., description="List of user's answers")

class LevelTestAnswerSchema(BaseModel):
    level_test_id: str = Field(..., description="ID of the level test")
    answers: List[str] = Field(..., description="List of user's answers")
