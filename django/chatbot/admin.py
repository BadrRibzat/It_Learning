from django.contrib import admin
from .models import ChatbotResponse

class ChatbotResponseAdmin(admin.ModelAdmin):
    list_display = ('input_text', 'response_text')
    search_fields = ('input_text', 'response_text')

admin.site.register(ChatbotResponse, ChatbotResponseAdmin)
