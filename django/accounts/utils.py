from django.db import connection
from django.db.utils import ProgrammingError
from django.apps import apps
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def send_verification_email(user, verification_token):
    verification_link = f"{settings.FRONTEND_URL}/verify-email/{verification_token}"
    
    # Render HTML email template
    html_message = render_to_string('emails/verification.html', {
        'user': user,
        'verification_link': verification_link
    })
    
    # Plain text version
    plain_message = strip_tags(html_message)
    
    send_mail(
        'Verify Your Email - Learn English Platform',
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        html_message=html_message,
        fail_silently=False,
    )

def send_password_reset_email(user, reset_token):
    reset_link = f"{settings.FRONTEND_URL}/reset-password/{reset_token}"
    
    # Render HTML email template
    html_message = render_to_string('emails/password_reset.html', {
        'user': user,
        'reset_link': reset_link
    })
    
    # Plain text version
    plain_message = strip_tags(html_message)
    
    send_mail(
        'Password Reset - Learn English Platform',
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        html_message=html_message,
        fail_silently=False,
    )

def ensure_schema():
    try:
        with connection.cursor() as cursor:
            for model in apps.get_models():
                table_name = model._meta.db_table
                
                # Check if table exists
                cursor.execute(f"""
                    SELECT EXISTS (
                        SELECT FROM information_schema.tables 
                        WHERE table_name = %s
                    );
                """, [table_name])
                
                table_exists = cursor.fetchone()[0]
                
                if not table_exists:
                    print(f"Creating table {table_name}")
                    create_table_sql = f"CREATE TABLE {table_name} ("
                    create_table_sql += "id SERIAL PRIMARY KEY"
                    
                    for field in model._meta.fields:
                        if field.name != 'id':  # Skip the id field as we've already added it
                            column_name = field.column
                            field_type = field.db_type(connection)
                            
                            # Check if the column name is a reserved keyword
                            if column_name.lower() in ['order', 'group', 'user']:
                                column_name = f'"{column_name}"'
                            
                            create_table_sql += f", {column_name} {field_type}"
                    
                    create_table_sql += ");"
                    
                    try:
                        cursor.execute(create_table_sql)
                        print(f"Table {table_name} created successfully")
                    except ProgrammingError as e:
                        print(f"Error creating table {table_name}: {str(e)}")
                
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
                        
                        if not column_exists:
                            print(f"Adding column {column_name} to table {table_name}")
                            field_type = field.db_type(connection)
                            
                            # Check if the column name is a reserved keyword
                            if column_name.lower() in ['order', 'group', 'user']:
                                column_name = f'"{column_name}"'
                            
                            try:
                                cursor.execute(f'ALTER TABLE {table_name} ADD COLUMN {column_name} {field_type};')
                            except ProgrammingError as e:
                                print(f"Error adding column {column_name}: {str(e)}")

    except Exception as e:
        print(f"Error in ensure_schema: {str(e)}")
    print("Schema check completed.")
