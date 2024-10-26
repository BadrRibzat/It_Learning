from django.contrib import admin
from .models import ChatbotResponse

@admin.register(ChatbotResponse)
class ChatbotResponseAdmin(admin.ModelAdmin):
    list_display = ('keyword', 'response')
    search_fields = ('keyword',)

admin.site.register(ChatbotResponse)
