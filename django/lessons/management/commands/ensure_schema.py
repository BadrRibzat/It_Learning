from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Ensure database schema compatibility'

    def handle(self, *args, **kwargs):
        try:
            with connection.cursor() as cursor:
                # Add order column to lessons_flashcard if not exists
                cursor.execute("""
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT FROM information_schema.columns 
                        WHERE table_name='lessons_flashcard' AND column_name='order'
                    ) THEN
                        ALTER TABLE lessons_flashcard 
                        ADD COLUMN "order" INTEGER DEFAULT 0;
                    END IF;
                END $$;
                """)

                # Add order column to lessons_quizquestion if not exists
                cursor.execute("""
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT FROM information_schema.columns 
                        WHERE table_name='lessons_quizquestion' AND column_name='order'
                    ) THEN
                        ALTER TABLE lessons_quizquestion 
                        ADD COLUMN "order" INTEGER DEFAULT 0;
                    END IF;
                END $$;
                """)

                # Add order column to lessons_leveltestquestion if not exists
                cursor.execute("""
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT FROM information_schema.columns 
                        WHERE table_name='lessons_leveltestquestion' AND column_name='order'
                    ) THEN
                        ALTER TABLE lessons_leveltestquestion 
                        ADD COLUMN "order" INTEGER DEFAULT 0;
                    END IF;
                END $$;
                """)

            self.stdout.write(self.style.SUCCESS('Schema compatibility checks completed successfully.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Schema compatibility error: {e}'))
