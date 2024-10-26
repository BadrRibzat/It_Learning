from django.db import models

class ChatbotResponse(models.Model):
    keyword = models.CharField(max_length=100)
    response = models.TextField()

    def __str__(self):
        return self.keyword

    input_text = models.CharField(max_length=255)
    response_text = models.TextField()

    def __str__(self):
        return f'Response for: {self.input_text}'

