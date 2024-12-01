import pytest
from lessons.models import Level, Lesson, Flashcard, Quiz, QuizQuestion, LevelTest, LevelTestQuestion

@pytest.mark.django_db
def test_level_creation():
    level = Level.objects.create(name='Beginner', position=1, passing_score=80, difficulty='beginner')
    assert level.name == 'Beginner'
    assert level.position == 1
    assert level.passing_score == 80
    assert level.difficulty == 'beginner'

@pytest.mark.django_db
def test_lesson_creation():
    level = Level.objects.create(name='Beginner', position=1, passing_score=80, difficulty='beginner')
    lesson = Lesson.objects.create(title='Test Lesson', level=level, position=1)
    assert lesson.title == 'Test Lesson'
    assert lesson.level == level
    assert lesson.position == 1

@pytest.mark.django_db
def test_flashcard_creation():
    level = Level.objects.create(name='Beginner', position=1, passing_score=80, difficulty='beginner')
    lesson = Lesson.objects.create(title='Test Lesson', level=level, position=1)
    flashcard = Flashcard.objects.create(lesson=lesson, word='Test', definition='Test Definition', position=1)
    assert flashcard.word == 'Test'
    assert flashcard.definition == 'Test Definition'
    assert flashcard.lesson == lesson
    assert flashcard.position == 1

@pytest.mark.django_db
def test_quiz_creation():
    level = Level.objects.create(name='Beginner', position=1, passing_score=80, difficulty='beginner')
    lesson = Lesson.objects.create(title='Test Lesson', level=level, position=1)
    quiz = Quiz.objects.create(lesson=lesson, title='Test Quiz', total_questions=1, passing_score=80)
    assert quiz.title == 'Test Quiz'
    assert quiz.lesson == lesson
    assert quiz.total_questions == 1
    assert quiz.passing_score == 80

@pytest.mark.django_db
def test_level_test_creation():
    level = Level.objects.create(name='Beginner', position=1, passing_score=80, difficulty='beginner')
    level_test = LevelTest.objects.create(level=level, total_questions=1, passing_score=80)
    assert level_test.level == level
    assert level_test.total_questions == 1
    assert level_test.passing_score == 80
