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
    # Get completed lessons for the current level
    completed_lessons = UserProgress.objects.filter(
        user=user, 
        completed=True, 
        lesson__level=user.level
    ).values_list('lesson_id', flat=True)

    # Recommend lessons for the current level that are accessible
    current_level = Level.objects.filter(level_order=user.level.level_order).first()
    recommended_lessons = Lesson.objects.filter(
        level=current_level
    ).exclude(id__in=completed_lessons).filter(
        pk__in=[lesson.pk for lesson in Lesson.objects.filter(level=current_level) if lesson.can_user_access(user)]
    )

    return recommended_lessons
