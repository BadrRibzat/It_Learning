# Generated by Django 5.1.2 on 2024-10-26 19:19

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lessons', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name='flashcard',
            name='meaning',
        ),
        migrations.RemoveField(
            model_name='flashcard',
            name='question',
        ),
        migrations.RemoveField(
            model_name='lesson',
            name='order',
        ),
        migrations.RemoveField(
            model_name='leveltestquestion',
            name='question',
        ),
        migrations.RemoveField(
            model_name='quizquestion',
            name='question',
        ),
        migrations.RemoveField(
            model_name='userflashcardprogress',
            name='correct_attempts',
        ),
        migrations.AddField(
            model_name='flashcard',
            name='definition',
            field=models.TextField(default='No definition available'),
        ),
        migrations.AddField(
            model_name='leveltest',
            name='title',
            field=models.CharField(default='Default Level Test Title', max_length=255),
        ),
        migrations.AddField(
            model_name='leveltestquestion',
            name='options',
            field=models.JSONField(default=list),
        ),
        migrations.AddField(
            model_name='leveltestquestion',
            name='question_text',
            field=models.TextField(default='Default Question Text'),
        ),
        migrations.AddField(
            model_name='quizquestion',
            name='options',
            field=models.JSONField(default=list),
        ),
        migrations.AddField(
            model_name='quizquestion',
            name='question_text',
            field=models.TextField(default='Default Question Text'),
        ),
        migrations.AddField(
            model_name='userflashcardprogress',
            name='date_completed',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='flashcard',
            name='word',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='difficulty',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='level_order',
            field=models.PositiveIntegerField(),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='title',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='level',
            name='level_order',
            field=models.PositiveIntegerField(),
        ),
        migrations.AlterField(
            model_name='level',
            name='name',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='leveltestquestion',
            name='correct_answer',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='quiz',
            name='title',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='quizquestion',
            name='correct_answer',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='userflashcardprogress',
            name='flashcard',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lessons.flashcard'),
        ),
        migrations.AlterField(
            model_name='userflashcardprogress',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='userlevelprogress',
            name='correct_answers',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='userlevelprogress',
            name='date_completed',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='userlevelprogress',
            name='level',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lessons.level'),
        ),
        migrations.AlterField(
            model_name='userlevelprogress',
            name='total_questions',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='userlevelprogress',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='userprogress',
            name='correct_answers',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='userprogress',
            name='date_completed',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='userprogress',
            name='total_questions',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='userprogress',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='userquizattempt',
            name='score',
            field=models.PositiveIntegerField(),
        ),
    ]
