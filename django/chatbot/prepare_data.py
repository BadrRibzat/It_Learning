from .models import ChatbotResponse

def prepare_training_data():
    return [
        # Greetings
        ("Hello", "Hi there! How can I help you today?"),
        ("Hi", "Hello! Welcome to the Language Learning Chatbot."),
        ("Hey", "Hi! Ready to learn some English?"),
        
        # About the Chatbot
        ("Who are you?", "I'm an AI Language Learning Assistant designed to help you improve your English skills."),
        ("What can you do?", "I can help with vocabulary, grammar, answer questions, and provide learning tips."),
        
        # Learning Assistance
        ("I want to learn English", "Great! What specific area would you like to focus on? Vocabulary, grammar, conversation?"),
        ("Help me with English", "Sure! I'm here to support your English learning journey. What would you like to learn?"),
        
        # Encouragement
        ("English is difficult", "Learning a language takes time and practice. Don't worry, I'm here to help you every step of the way!"),
        ("I'm struggling", "Every expert was once a beginner. Keep practicing, and you'll improve!"),
        
        # Playful Interactions
        ("Tell me a joke", "Why do English teachers love punctuation? Because they find it very satisfying!"),
        ("Are you smart?", "I'm knowledgeable about language learning, but true intelligence comes from continuous learning."),
        
        # Farewell
        ("Goodbye", "Goodbye! Keep practicing your English."),
        ("See you later", "See you soon! Remember, every conversation is a chance to learn."),
    ]
