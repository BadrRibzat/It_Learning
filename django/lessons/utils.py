from django.db import connection
from django.db.utils import ProgrammingError
from django.apps import apps

def ensure_schema_compatibility():
    try:
        with connection.cursor() as cursor:
            models_to_check = apps.get_models()

            for model in models_to_check:
                table_name = model._meta.db_table
                
                # Check if the table exists
                cursor.execute(f"""
                    SELECT EXISTS (
                        SELECT FROM information_schema.tables 
                        WHERE table_name = %s
                    );
                """, [table_name])
                table_exists = cursor.fetchone()[0]

                # If the table does not exist, create it
                if not table_exists:
                    create_table_sql = f"CREATE TABLE {table_name} (id SERIAL PRIMARY KEY"
                    for field in model._meta.fields:
                        if field.name != "id":
                            column_name = field.column
                            field_type = field.db_type(connection)
                            
                            # Special handling for order columns
                            if column_name == 'order':
                                field_type = 'INTEGER DEFAULT 0'
                            
                            create_table_sql += f", {column_name} {field_type}"
                    create_table_sql += ");"
                    try:
                        cursor.execute(create_table_sql)
                        print(f"Table {table_name} created successfully.")
                    except ProgrammingError as e:
                        print(f"Error creating table {table_name}: {e}")

                # Check columns for existing tables
                else:
                    for field in model._meta.fields:
                        column_name = field.column
                        cursor.execute(f"""
                            SELECT EXISTS (
                                SELECT FROM information_schema.columns 
                                WHERE table_name = %s AND column_name = %s
                            );
                        """, [table_name, column_name])
                        column_exists = cursor.fetchone()[0]

                        # If the column does not exist, add it
                        if not column_exists:
                            field_type = field.db_type(connection)
                            
                            # Special handling for order columns
                            if column_name == 'order':
                                field_type = 'INTEGER DEFAULT 0'
                            
                            try:
                                cursor.execute(f'ALTER TABLE {table_name} ADD COLUMN {column_name} {field_type};')
                                print(f"Added column {column_name} to table {table_name}.")
                            except ProgrammingError as e:
                                print(f"Error adding column {column_name}: {e}")

    except Exception as e:
        print(f"Schema compatibility check failed: {e}")

def get_recommended_lessons(user):
    """
    Intelligently recommend lessons based on user's current level and progress    
    Recommendation Strategy:
    1. Ensure lessons are from the user's current level
    2. Filter out already completed lessons
    3. Consider user's progress percentage
    4. Prioritize lessons based on adaptive difficulty
    """
    from django.db.models import Q, Count
    from lessons.models import (
            Level, 
            Lesson, 
            UserProgress, 
            UserQuizAttempt, 
            UserFlashcardProgress
            )
    
    if not user.level:
        try:
            user.level, _ = Level.objects.update_or_create(
                name='Beginner', 
                defaults={
                    'difficulty': 'beginner', 
                    'level_order': 1, 
                    'points_to_advance': 100
                }
            )
            user.save()
        except Level.MultipleObjectsReturned:
            levels = Level.objects.filter(name='Beginner')
            first_level = levels.first()
            levels.exclude(id=first_level.id).delete()
            user.level = first_level
            user.save()

    try:
        progress_data = user.calculate_level_progress()
        progress_percentage = progress_data.get('progress_percentage', 0)
    except Exception:
        progress_percentage = 0

    completed_lesson_ids = UserProgress.objects.filter(
        user=user, 
        completed=True, 
        lesson__level=user.level
    ).values_list('lesson_id', flat=True)

    recommended_lessons = Lesson.objects.filter(
        level=user.level
    ).exclude(
        id__in=completed_lesson_ids
    )

    if progress_percentage < 30:
        recommended_lessons = recommended_lessons.filter(
            Q(difficulty='beginner') | Q(difficulty=user.level.difficulty)
        )
    elif progress_percentage < 70:
        recommended_lessons = recommended_lessons.filter(
            Q(difficulty__in=['beginner', 'intermediate']) | 
            Q(difficulty=user.level.difficulty)
        )
    else:
        recommended_lessons = recommended_lessons.filter(
            Q(difficulty__in=['intermediate', 'advanced']) | 
            Q(difficulty=user.level.difficulty)
        )

    recommended_lessons = recommended_lessons.annotate(
        total_flashcards=Count('flashcards'),
        total_quizzes=Count('quizzes')
    ).order_by(
        '-total_flashcards', 
        '-total_quizzes'
    )

    filtered_lessons = []
    for lesson in recommended_lessons:
        try:
            if lesson.can_user_access(user):
                filtered_lessons.append(lesson)
                if len(filtered_lessons) == 5:
                    break
        except Exception:
            continue

    return filtered_lessons
