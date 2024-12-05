from django.core.management.base import BaseCommand
from lessons.models import Level
from django.db import transaction

class Command(BaseCommand):
    help = 'Initialize basic data for the application'

    def handle(self, *args, **options):
        try:
            with transaction.atomic():
                # First, check existing levels
                existing_levels = Level.objects.all()
                if existing_levels.exists():
                    self.stdout.write(self.style.WARNING('Cleaning up existing levels...'))
                    existing_levels.delete()

                # Create basic levels
                levels = [
                    {'name': 'Beginner', 'position': 1, 'difficulty': 'beginner'},
                    {'name': 'Intermediate', 'position': 2, 'difficulty': 'intermediate'},
                    {'name': 'Advanced', 'position': 3, 'difficulty': 'advanced'}
                ]

                created_levels = []
                for level_data in levels:
                    level = Level.objects.create(
                        name=level_data['name'],
                        position=level_data['position'],
                        difficulty=level_data['difficulty'],
                        points_to_advance=100,
                        passing_score=80
                    )
                    created_levels.append(level)
                    self.stdout.write(
                        self.style.SUCCESS(
                            f'Successfully created level: {level.name}'
                        )
                    )

                self.stdout.write(
                    self.style.SUCCESS(
                        f'Successfully initialized {len(created_levels)} levels'
                    )
                )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error initializing data: {str(e)}')
            )
            raise
