from .models import Lesson, Level, UserProgress

def get_recommended_lessons(user):
    # Get completed lessons for the current level
    completed_lessons = UserProgress.objects.filter(
        user=user, 
        completed=True, 
        lesson__level__level_order=user.level
    ).values_list('lesson_id', flat=True)

    # Recommend lessons for the current level that are not completed
    current_level = Level.objects.filter(level_order=user.level).first()
    recommended_lessons = Lesson.objects.filter(
        level=current_level
    ).exclude(id__in=completed_lessons)

    return recommended_lessons
