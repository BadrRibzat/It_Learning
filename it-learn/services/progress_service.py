from typing import Dict, List  # Import List explicitly
from pymongo import MongoClient
from bson import ObjectId
from utils.redis_cache import cache
from utils.db import get_db
from config import config
import logging

logger = logging.getLogger(__name__)


class ProgressService:
    def __init__(self):
        self.db = get_db()

    def serialize_mongodb_object(self, obj):
        """Serialize MongoDB objects to JSON-compatible format."""
        if isinstance(obj, dict):
            return {k: self.serialize_mongodb_object(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self.serialize_mongodb_object(item) for item in obj]
        elif isinstance(obj, ObjectId):
            return str(obj)
        return obj

    def track_flashcard_progress(self, user_id: str, lesson_id: str, flashcard_id: str, is_correct: bool):
        """
        Update user progress for flashcards.
        Automatically unlocks the quiz when all flashcards are completed.
        """
        self.db.lessons_progress.update_one(
            {"user": ObjectId(user_id), "lesson": ObjectId(lesson_id)},
            {
                "$set": {"last_flashcard": ObjectId(flashcard_id)},
                "$inc": {"correct_answers": 1} if is_correct else {"incorrect_answers": 1},
            },
            upsert=True,
        )

        if self._should_unlock_quiz(user_id, lesson_id):
            self._create_quiz_entry(user_id, lesson_id)

    @cache(ttl=1800)
    def get_lesson_progress(self, user_id: str, lesson_id: str) -> Dict:
        """
        Get detailed progress for a specific lesson.
        Returns:
            - Completed flashcards count
            - Total flashcards count
            - Quiz unlock status
        """
        progress = self.db.lessons_progress.find_one(
            {"user": ObjectId(user_id), "lesson": ObjectId(lesson_id)}
        )
        if not progress:
            return {
                "completed_flashcards": 0,
                "total_flashcards": 10,
                "quiz_unlocked": False,
            }

        # Find the associated quiz for this lesson
        quiz = self.db.quizzes.find_one({"lesson": ObjectId(lesson_id)})
        if not quiz:
            return {
                "completed_flashcards": progress.get("correct_answers", 0),
                "total_flashcards": 10,
                "quiz_unlocked": False,
            }

        # Check if user has access to the quiz
        quiz_entry = self.db.users.find_one(
            {"_id": ObjectId(user_id), "available_quizzes": quiz["_id"]}
        )
        return {
            "completed_flashcards": progress.get("correct_answers", 0),
            "total_flashcards": 10,
            "quiz_unlocked": bool(quiz_entry),
        }

    def _create_quiz_entry(self, user_id: str, lesson_id: str):
        """Mark the quiz as available for the user."""
        quiz = self.db.quizzes.find_one({"lesson": ObjectId(lesson_id)})
        if quiz:  # Only update if quiz exists
            self.db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$addToSet": {"available_quizzes": quiz["_id"]}},
                upsert=True,
            )

    def _should_unlock_quiz(self, user_id: str, lesson_id: str) -> bool:
        """Check if the user has completed all flashcards in the lesson."""
        progress = self.get_lesson_progress(user_id, lesson_id)
        return progress["completed_flashcards"] >= 10

    def check_level_test_eligibility(self, user_id: str, level_id: str) -> bool:
        """
        Verify if the user is eligible to take the level test.
        Eligibility criteria:
            - All lessons in the level must be completed.
            - All quizzes in the level must be passed.
        """
        lessons = list(self.db.lessons.find({"level": ObjectId(level_id)}))
        for lesson in lessons:
            progress = self.get_lesson_progress(user_id, str(lesson["_id"]))
            if progress["completed_flashcards"] < 10 or not progress["quiz_unlocked"]:
                return False

            # Ensure the user has passed the quiz
            quiz = self.db.quizzes.find_one({"lesson": lesson["_id"]})
            if quiz:
                submission = self.db.quiz_submissions.find_one(
                    {
                        "user": ObjectId(user_id),
                        "quiz": quiz["_id"],
                        "passed": True,
                    }
                )
                if not submission:
                    return False

        return True

    def attempt_level_unlock(self, user_id: str, test_id: str) -> Dict:
        """
        Process level test submission and unlock the next level if criteria are met.
        Args:
            user_id (str): The ID of the user.
            test_id (str): The ID of the level test.
        Returns:
            A dictionary containing:
                - unlocked (bool): Whether the level was unlocked.
                - score (float): The user's score on the test.
                - level_name (str): The name of the unlocked level (if applicable).
                - level_order (int): The order of the unlocked level (if applicable).
        """
        if not ObjectId.is_valid(test_id):
            raise ValueError("Invalid level test ID format")

        test = self.db.level_tests.find_one({"_id": ObjectId(test_id)})
        if not test:
            raise ValueError("Test not found")

        submissions = list(
            self.db.level_test_submissions.find(
                {"user": ObjectId(user_id), "level_test": ObjectId(test_id)}
            ).sort("submitted_at", -1)
        )
        if not submissions:
            return {"unlocked": False, "required_score": 0.8}

        best_submission = max(submissions, key=lambda x: x.get("score", 0), default=None)
        if (
            best_submission
            and best_submission["score"] >= 0.8 * test["total_questions"]
        ):
            # Get the level being tested
            level = self.db.levels.find_one({"_id": test["level"]})
            if level:
                self.db.users.update_one(
                    {"_id": ObjectId(user_id)},
                    {
                        "$addToSet": {"unlocked_levels": level["name"]},
                        "$set": {"current_level": level["order"]},
                    },
                )
                return {
                    "unlocked": True,
                    "score": best_submission["score"],
                    "level_name": level["name"],
                    "level_order": level["order"],
                }

        return {"unlocked": False, "required_score": 0.8}

    def get_level_progression(self, user_id: str) -> Dict:
        """
        Get the user's current level progression and unlock requirements.
        Returns:
            - current_level (str): The name of the user's current level.
            - next_level (str): The name of the next level (if available).
            - required_score (float): The passing score required for level tests.
            - unlocked_levels (list): List of unlocked level names.
            - progress (int): Overall progress percentage.
            - levels (list): Array of level cards with unlock status.
        """
        try:
            user = self.db.users.find_one({"_id": ObjectId(user_id)})
            levels = list(self.db.levels.find().sort("order", 1))

            if not user:
                # Return default level progression for new users with all levels info
                return {
                    "current_level": "beginner",
                    "next_level": "intermediate",
                    "required_score": 0.8,
                    "unlocked_levels": ["beginner"],
                    "progress": 0,
                    "levels": [
                        self._format_level_card(level, ["beginner"]) for level in levels
                    ],
                }

            # Get current level
            current_level = self.db.levels.find_one(
                {"order": user.get("current_level", 1)}
            )
            if not current_level:
                current_level = {"name": "beginner", "order": 1}

            unlocked_levels = user.get("unlocked_levels", ["beginner"])
            if "beginner" not in unlocked_levels:
                unlocked_levels.append("beginner")

            next_level = self._get_next_level(current_level["order"])
            next_level_name = next_level["name"] if next_level else None

            return {
                "current_level": current_level["name"],
                "next_level": next_level_name,
                "required_score": 0.8,
                "unlocked_levels": unlocked_levels,
                "progress": user.get("level_progress", 0),
                "levels": [
                    self._format_level_card(level, unlocked_levels) for level in levels
                ],
            }
        except Exception as e:
            logger.error(f"Error getting level progression: {str(e)}")
            raise ValueError("Failed to fetch level progression")

    def _format_level_card(self, level: Dict, unlocked_levels: List[str]) -> Dict:
        """
        Format level data into a card format.
        Args:
            level (Dict): Level data from the database.
            unlocked_levels (List[str]): List of unlocked level names.
        Returns:
            A dictionary containing:
                - id (str): Level ID.
                - name (str): Level name.
                - order (int): Level order.
                - description (str): Level description.
                - icon (str): Level icon URL.
                - is_unlocked (bool): Whether the level is unlocked.
                - required_score (float): Passing score required for the level test.
                - test_available (bool): Whether the level test is available.
        """
        return {
            "id": str(level["_id"]),
            "name": level["name"],
            "order": level["order"],
            "description": level.get("description", ""),
            "icon": level.get("icon", ""),
            "is_unlocked": level["name"] == "beginner" or level["name"] in unlocked_levels,
            "required_score": 0.8,
            "test_available": level["name"] != "beginner",
        }

    def _get_next_level(self, current_order: int) -> Optional[Dict]:
        """Get the next level based on the current order."""
        return self.db.levels.find_one({"order": current_order + 1})

    def update_user_points(self, user_id: str, points: int):
        """
        Update the user's total points.
        Args:
            user_id (str): The ID of the user.
            points (int): Points to add to the user's total.
        """
        self.db.users.update_one(
            {"_id": ObjectId(user_id)}, {"$inc": {"total_points": points}}, upsert=True
        )

    def get_user_progress(self, user_id: str, level_id: str) -> Dict:
        """
        Get comprehensive progress data for a specific level.
        Returns:
            A dictionary containing:
                - completed_lessons (int): Number of completed lessons.
                - total_lessons (int): Total number of lessons in the level.
                - lessons_progress (list): Individual lesson progress statistics.
                - quiz_scores (list): Scores from previous quizzes.
                - level_test_available (bool): Whether the level test is available.
                - next_level_unlocked (bool): Whether the next level is unlocked.
                - total_points (int): Total points earned in the level.
        """
        try:
            user = self.db.users.find_one({"_id": ObjectId(user_id)})
            level = self.db.levels.find_one({"_id": ObjectId(level_id)})

            if not level:
                raise ValueError("Level not found")

            lessons = list(self.db.lessons.find({"level": level["_id"]}).sort("order", 1))
            lessons_progress = []
            total_points = 0

            for lesson in lessons:
                progress = self.get_lesson_progress(user_id, str(lesson["_id"]))
                lessons_progress.append(progress)
                flashcard_points = progress.get("correct_answers", 0) * 10
                total_points += flashcard_points

            # Get quiz scores and points
            quiz_scores = []
            for lesson in lessons:
                quiz = self.db.quizzes.find_one({"lesson": lesson["_id"]})
                if quiz:
                    submission = self.db.quiz_submissions.find_one(
                        {
                            "user": ObjectId(user_id),
                            "quiz": quiz["_id"],
                            "passed": True,
                        }
                    )
                    if submission:
                        quiz_scores.append(int(submission["score"] * 100))
                        total_points += submission.get("points_earned", 0)

            # Calculate completion status
            completed_lessons = sum(
                1 for p in lessons_progress if p["completed_flashcards"] >= 10
            )
            all_quizzes_passed = all(
                self.db.quiz_submissions.find_one(
                    {
                        "user": ObjectId(user_id),
                        "quiz": db.quizzes.find_one({"lesson": lesson["_id"]})["_id"],
                        "passed": True,
                    }
                )
                for lesson in lessons
                if db.quizzes.find_one({"lesson": lesson["_id"]})
            )

            # Check level test availability
            level_test_available = completed_lessons == len(lessons) and all_quizzes_passed

            # Check if the next level is unlocked
            next_level = self._get_next_level(level["order"])
            next_level_unlocked = (
                next_level
                and str(next_level["_id"]) in [str(l) for l in user.get("unlocked_levels", [])]
            )

            return {
                "current_level": level["name"],
                "completed_lessons": completed_lessons,
                "total_lessons": len(lessons),
                "lessons_progress": lessons_progress,
                "quiz_scores": quiz_scores,
                "level_test_available": level_test_available,
                "next_level_unlocked": next_level_unlocked,
                "total_points": total_points,
            }
        except Exception as e:
            logger.error(f"Error fetching user progress: {str(e)}")
            raise ValueError("Failed to fetch user progress")
