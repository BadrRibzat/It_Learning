import pytest
from lessons.models import Level, Lesson, Flashcard

@pytest.mark.django_db
class TestLessonModels:
    def test_create_level(self):
        level = Level.objects.create(name="Beginner", level_order=1)
        assert level.name == "Beginner"
        assert level.level_order == 1

    def test_create_lesson(self):
        level = Level.objects.create(name="Beginner", level_order=1)
        lesson = Lesson.objects.create(
            title="Basic Greetings",
            level=level,
            level_order=1,
            content="Learn common English greetings",
            difficulty="beginner"
        )
        assert lesson.title == "Basic Greetings"
        assert lesson.level == level
        assert lesson.difficulty == "beginner"

    def test_create_flashcard(self):
        level = Level.objects.create(name="Beginner", level_order=1)
        lesson = Lesson.objects.create(
            title="Basic Greetings",
            level=level,
            level_order=1,
            content="Learn common English greetings",
            difficulty="beginner"
        )
        flashcard = Flashcard.objects.create(
            lesson=lesson,
            word="Hello",
            definition="A common greeting",
            question="What do you say to greet someone?"
        )
        assert flashcard.word == "Hello"
        assert flashcard.lesson == lesson
