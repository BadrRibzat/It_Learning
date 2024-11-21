from django.db import connection
from django.db.utils import ProgrammingError
from django.apps import apps
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def ensure_schema_compatibility():
    try:
        with connection.cursor() as cursor:
            models_to_check = apps.get_models()

            for model in models_to_check:
                table_name = model._meta.db_table
                cursor.execute(f"SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = %s);", [table_name])
                table_exists = cursor.fetchone()[0]

                if not table_exists:
                    # Create table with all fields
                    # (This approach is risky; consider using Django migrations instead)
                    create_table_sql = f"CREATE TABLE {table_name} (id SERIAL PRIMARY KEY"
                    for field in model._meta.fields:
                        if field.name != "id":
                            column_name = field.column
                            field_type = field.db_type(connection)
                            create_table_sql += f", {column_name} {field_type}"
                    create_table_sql += ");"
                    cursor.execute(create_table_sql)
                    print(f"Table {table_name} created successfully.")
                else:
                    for field in model._meta.fields:
                        column_name = field.column
                        if column_name == "order":
                            column_name = '"order"'  # Escape reserved keyword
                        cursor.execute(f"SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = %s AND column_name = %s);", [table_name, column_name])
                        column_exists = cursor.fetchone()[0]

                        if not column_exists:
                            field_type = field.db_type(connection)
                            alter_table_sql = f'ALTER TABLE {table_name} ADD COLUMN {column_name} {field_type};'
                            cursor.execute(alter_table_sql)
                            print(f"Added column {column_name} to table {table_name}.")
                        else:
                            print(f"Column {column_name} already exists in table {table_name}.")
    except Exception as e:
        print(f"Schema compatibility check failed: {e}")

def ensure_schema():
    ensure_schema_compatibility()
    print("Schema check completed.")

def send_verification_email(user, verification_token):
    verification_link = f"{settings.FRONTEND_URL}/verify-email/{verification_token}"
    render_and_send_mail(user, 'emails/verification.html', verification_link)

def send_password_reset_email(user, reset_token):
    reset_link = f"{settings.FRONTEND_URL}/reset-password/{reset_token}"
    render_and_send_mail(user, 'emails/password_reset.html', reset_link)

def render_and_send_mail(user, template, link):
    html_message = render_to_string(template, {
        'username': user.username,
        'link': link,
        'platform_name': 'Learn English Platform'
    })
    plain_message = strip_tags(html_message)
    send_mail(
        'Important - Learn English Platform',
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        html_message=html_message,
        fail_silently=False,
    )
