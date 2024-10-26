from django.db import models

class ChatbotResponse(models.Model):
    input_text = models.CharField(max_length=255, unique=True)
    response_text = models.TextField()

    def __str__(self):
        return self.input_text
