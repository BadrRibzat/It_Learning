from lessons.models import Lesson, Level, UserProgress, UserLevelProgress

def get_recommended_lessons(user):
    # Check if the user has completed the level test for the next level
    next_level = Level.objects.filter(level_order=user.level + 1).first()
    if next_level:
        level_progress = UserLevelProgress.objects.filter(user=user, level=next_level).first()
        if not level_progress or not level_progress.completed:
            # User must pass the level test to unlock lessons for the next level
            return []

    # Get completed lessons for the current level
    completed_lessons = UserProgress.objects.filter(user=user, completed=True).values_list('lesson_id', flat=True)

    # Recommend lessons for the current level
    current_level = Level.objects.filter(level_order=user.level).first()
    if current_level:
        recommended_lessons = Lesson.objects.filter(level=current_level).exclude(id__in=completed_lessons)
    else:
        recommended_lessons = Lesson.objects.exclude(id__in=completed_lessons)

    return recommended_lessons
