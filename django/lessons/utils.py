import logging
from django.db.models import Q
from .models import Level, Lesson, UserProgress

logger = logging.getLogger(__name__)

def get_recommended_lessons(user):
    """
    Retrieve recommended lessons for a user based on their current progress
    
    Args:
        user (User): The current user
    
    Returns:
        QuerySet: Recommended lessons for the user
    """
    logger.info(f"Fetching recommended lessons for user: {user.username}")
    
    # Determine user's current level
    try:
        # Get the user's current progress or default to beginner
        user_progress = UserProgress.objects.filter(user=user).order_by('-last_updated').first()
        
        if not user_progress:
            # If no progress, start with beginner level
            current_level = Level.objects.get(name='beginner')
        else:
            current_level = user_progress.level
        
        logger.info(f"Current User Level: {current_level.name}")
        
        # Get completed lesson IDs for this level
        completed_lesson_ids = UserProgress.objects.filter(
            user=user, 
            level=current_level,
            quiz_completed=True
        ).values_list('lesson_id', flat=True)
        
        # Find recommended lessons
        recommended_lessons = Lesson.objects.filter(
            level=current_level
        ).exclude(
            id__in=completed_lesson_ids
        )
        
        # Additional filtering for lesson accessibility
        filtered_lessons = [
            lesson for lesson in recommended_lessons 
            if can_user_access_lesson(user, lesson)
        ]
        
        # Limit to 5 recommended lessons
        recommended_lessons = filtered_lessons[:5]
        
        logger.info(f"Number of Recommended Lessons: {len(recommended_lessons)}")
        
        return recommended_lessons
    
    except Exception as e:
        logger.error(f"Error fetching recommended lessons: {str(e)}")
        return []

def can_user_access_lesson(user, lesson):
    """
    Check if a user can access a specific lesson
    
    Args:
        user (User): The current user
        lesson (Lesson): The lesson to check access for
    
    Returns:
        bool: Whether the user can access the lesson
    """
    # If it's a beginner level lesson, always accessible
    if lesson.level.name == 'beginner':
        return True
    
    # Check if user has passed previous level
    try:
        # Find the previous level
        previous_levels = Level.objects.filter(position__lt=lesson.level.position).order_by('-position')
        
        # Check progress for each previous level
        for previous_level in previous_levels:
            level_progress = UserProgress.objects.filter(
                user=user, 
                level=previous_level,
                level_unlocked=True
            ).exists()
            
            if not level_progress:
                return False
        
        return True
    
    except Exception as e:
        logger.error(f"Error checking lesson access: {str(e)}")
        return False

def track_user_progress(user, lesson, quiz_score=None, level_test_score=None):
    """
    Update or create user progress tracking
    
    Args:
        user (User): The current user
        lesson (Lesson): The lesson being tracked
        quiz_score (float, optional): Score from lesson quiz
        level_test_score (float, optional): Score from level test
    
    Returns:
        UserProgress: Updated or created progress object
    """
    try:
        progress, created = UserProgress.objects.get_or_create(
            user=user,
            lesson=lesson,
            level=lesson.level
        )
        
        if quiz_score is not None:
            progress.quiz_score = quiz_score
            progress.quiz_completed = quiz_score >= lesson.quizzes.first().passing_score
        
        if level_test_score is not None:
            progress.level_test_score = level_test_score
            progress.level_unlocked = level_test_score >= progress.level.passing_score
        
        progress.save()
        
        return progress
    
    except Exception as e:
        logger.error(f"Error tracking user progress: {str(e)}")
        return None
