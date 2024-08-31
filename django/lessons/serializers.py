from rest_framework import serializers
from .models import Lesson, Test

class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ['id', 'questions']

class LessonSerializer(serializers.ModelSerializer):
    test = TestSerializer(read_only=True)
    
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'level', 'order', 'test']
