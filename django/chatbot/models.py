from django.db import models

class ChatbotResponse(models.Model):
    keyword = models.CharField(max_length=100)
    response = models.TextField()

    def __str__(self):
        return self.keyword
