# Generated by Django 4.2.7 on 2024-11-21 16:48

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("lessons", "0002_remove_level_level_position"),
    ]

    operations = [
        migrations.AddField(
            model_name="level",
            name="difficulty",
            field=models.CharField(default="beginner", max_length=50),
        ),
        migrations.AddField(
            model_name="level",
            name="points_to_advance",
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name="level",
            name="name",
            field=models.CharField(max_length=100),
        ),
    ]
