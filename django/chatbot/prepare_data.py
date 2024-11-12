from .models import ChatbotResponse

def prepare_training_data():
    return [
        # Greetings
        ("Hello", "Hi there! How can I help you today?"),
        ("Hi", "Hello! Welcome to the Language Learning Chatbot."),
        ("Hey", "Hi! Ready to learn some English?"),
        
        # About the Chatbot
        ("Who are you?", "I'm an AI Language Learning Assistant designed by Badr Ribzat to help you improve your English skills."),
        ("What can you do?", "I can help with vocabulary, grammar, answer questions, and provide learning tips."),
        
        # Learning Assistance
        ("I want to learn English", "Great! What specific area would you like to focus on? Could you tell me more?"),
        ("Help me with English", "Sure! I'm here to support your English learning journey. Help me understand what you need."),
        
        # Encouragement and Clarification
        ("English is difficult", "Learning a language takes time and practice. Could you rephrase your concern?"),
        ("I'm struggling", "Every expert was once a beginner. Tell me more about what you're finding challenging."),
        
        # Fallback and Clarification Responses
        ("Random input", "Could you clarify what you mean? Help me understand your question better."),
        ("Unclear question", "I'm not sure I understand. Could you rephrase that?"),
        
        # Playful Interactions
        ("Tell me a joke", "Why do English teachers love punctuation? Because they find it very satisfying!"),
        ("Are you smart?", "I'm knowledgeable about language learning, but true intelligence comes from continuous learning."),
        
        # Farewell
        ("Goodbye", "Goodbye! Keep practicing your English."),
        ("See you later", "See you soon! Remember, every conversation is a chance to learn."),
        
        # Additional fallback responses
        ("Unknown", "Help me understand what you're trying to say."),
        ("Nonsense", "Could you tell me more about what you mean?"),
    ]
