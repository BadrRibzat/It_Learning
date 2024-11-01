from lessons.models import Lesson, Level, UserProgress

def get_recommended_lessons(user):
    completed_lessons = UserProgress.objects.filter(user=user, completed=True).values_list('lesson_id', flat=True)
    next_level = Level.objects.filter(level_order=user.level + 1).first()
    if next_level:
        recommended_lessons = Lesson.objects.filter(level=next_level).exclude(id__in=completed_lessons)
    else:
        recommended_lessons = Lesson.objects.exclude(id__in=completed_lessons)
    return recommended_lessons
