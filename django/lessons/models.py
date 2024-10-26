from django.db import models

class Level(models.Model):
    name = models.CharField(max_length=100)
    level_order = models.IntegerField()

    def __str__(self):
        return self.name

class Lesson(models.Model):
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    title = models.CharField(max_length=200)
    level = models.ForeignKey(Level, on_delete=models.CASCADE)
    level_order = models.IntegerField()
    content = models.TextField()
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='beginner')
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.title

class Flashcard(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    word = models.CharField(max_length=100)
    meaning = models.CharField(max_length=200)
    question = models.CharField(max_length=200)

    def __str__(self):
        return self.word

class Quiz(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)

    def __str__(self):
        return self.title

class QuizQuestion(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    question = models.CharField(max_length=200)
    correct_answer = models.CharField(max_length=200)

    def __str__(self):
        return self.question

class LevelTest(models.Model):
    level = models.ForeignKey(Level, on_delete=models.CASCADE)

    def __str__(self):
        return f"Level Test for {self.level.name}"

class LevelTestQuestion(models.Model):
    level_test = models.ForeignKey(LevelTest, on_delete=models.CASCADE)
    question = models.CharField(max_length=200)
    correct_answer = models.CharField(max_length=200)

    def __str__(self):
        return self.question

class UserProgress(models.Model):
    user = models.ForeignKey('accounts.User', related_name='progress', on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    date_completed = models.DateTimeField(auto_now_add=True)
    correct_answers = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username}'s progress on {self.lesson.title}"

    def complete_lesson(self):
        self.completed = True
        self.save()

    def update_progress(self, is_correct):
        self.total_questions += 1
        if is_correct:
            self.correct_answers += 1
        if self.total_questions == self.lesson.flashcard_set.count():
            self.completed = True
        self.save()

class UserQuizAttempt(models.Model):
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.IntegerField()
    date_attempted = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s attempt on {self.quiz.title}"

class UserFlashcardProgress(models.Model):
    user = models.ForeignKey('accounts.User', related_name='flashcard_progress', on_delete=models.CASCADE)
    flashcard = models.ForeignKey(Flashcard, related_name='lessons_flashcard_progress', on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    correct_attempts = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user.username}'s progress on {self.flashcard.word}"

    def complete_flashcard(self):
        self.completed = True
        self.correct_attempts += 1
        self.save()

class UserLevelProgress(models.Model):
    user = models.ForeignKey('accounts.User', related_name='level_progress', on_delete=models.CASCADE)
    level = models.ForeignKey(Level, related_name='lessons_level_progress', on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    date_completed = models.DateTimeField(auto_now_add=True)
    correct_answers = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username}'s progress on {self.level.name}"

    def complete_level(self):
        self.completed = True
        self.save()

    def update_progress(self, is_correct):
        self.total_questions += 1
        if is_correct:
            self.correct_answers += 1
        self.save()
