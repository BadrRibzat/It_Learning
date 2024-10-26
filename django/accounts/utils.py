from django.db import connection
from django.db.utils import ProgrammingError
from django.apps import apps

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
