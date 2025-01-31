from utils.db import get_db
import uuid
import random
from datetime import datetime
from typing import Dict, List, Optional
import logging
from .scripts.command_responses import COMMAND_RESPONSES, CONVERSATION_PATTERNS, LEARNING_PATHS

logger = logging.getLogger(__name__)

def get_creator_info() -> Dict:
    """Get creator information"""
    return {
        'name': 'Badr Ribzat',
        'role': 'Full-Stack Software Engineer',
        'age': 34,
        'social_media': {
            'LinkedIn': 'https://www.linkedin.com/in/badr-ribzat14121990/',
            'GitHub': 'https://github.com/BadrRibzat',
            'Facebook': 'https://www.facebook.com/Badr.rRibzat',
            'Instagram': 'https://www.instagram.com/badrrbzat/profilecard/'
        }
    }

def get_random_response(responses: List[str]) -> str:
    """Get a random response from a list of possibilities"""
    return random.choice(responses)

def detect_intent(user_input: str) -> str:
    """Detect the user's intent from their input"""
    user_input_lower = user_input.lower()
    
    # Define intent patterns
    patterns = {
        'greeting': ['hello', 'hi', 'hey', 'greetings'],
        'farewell': ['bye', 'goodbye', 'see you', 'quit'],
        'help': ['help', 'guide', 'assist', 'how do i'],
        'creator': ['who created', 'who made', 'creator', 'about badr'],
        'beginner': ['beginner', 'start', 'new', 'basics'],
        'command': ['how to use', 'what is', 'explain', 'show me'],
    }
    
    # Check each pattern
    for intent, keywords in patterns.items():
        if any(keyword in user_input_lower for keyword in keywords):
            return intent
    
    return 'general'

def get_command_from_input(user_input: str) -> Optional[str]:
    """Extract command name from user input"""
    common_commands = list(COMMAND_RESPONSES.keys())
    user_input_lower = user_input.lower()
    
    for cmd in common_commands:
        if cmd in user_input_lower:
            return cmd
    return None

def format_response(text: str, format_type: str = 'detailed') -> str:
    """Format response based on preferred format"""
    if format_type == 'concise':
        sentences = text.split('.')
        return (sentences[0].strip() + '.') if sentences else text.split('\n')[0]
    return text

def get_learning_path(level: str = 'beginner') -> List[Dict]:
    """Get structured learning path content"""
    return LEARNING_PATHS.get(level, LEARNING_PATHS['beginner'])

def generate_chat_response(
    user_input: str,
    context: Optional[str] = None,
    response_format: str = 'detailed'
) -> Dict:
    """Generate comprehensive chat response"""
    db = get_db()
    conversation_id = context or str(uuid.uuid4())
    
    try:
        # Detect user intent
        intent = detect_intent(user_input)
        
        # Process based on intent
        if intent == 'greeting':
            response = {
                'response_text': get_random_response(CONVERSATION_PATTERNS['greeting']),
                'response_type': 'greeting'
            }
        
        elif intent == 'farewell':
            response = {
                'response_text': get_random_response(CONVERSATION_PATTERNS['farewell']),
                'response_type': 'farewell'
            }
        
        elif intent == 'creator':
            creator = get_creator_info()
            response = {
                'response_text': (
                    f"I was created by {creator['name']}, a {creator['age']}-year-old "
                    f"{creator['role']} passionate about making technology learning accessible. "
                    f"Connect with him on LinkedIn: {creator['social_media']['LinkedIn']}"
                ),
                'response_type': 'creator_info'
            }
        
        elif intent == 'help':
            response = {
                'response_text': get_random_response(CONVERSATION_PATTERNS['help']),
                'response_type': 'help',
                'additional_data': {
                    'available_commands': list(COMMAND_RESPONSES.keys()),
                    'learning_paths': list(LEARNING_PATHS.keys())
                }
            }
        
        elif intent == 'beginner':
            learning_path = get_learning_path('beginner')
            response = {
                'response_text': (
                    "Let's start with the basics! Here's your learning path:\n\n" +
                    "\n".join(f"{i+1}. {topic['topic']}" for i, topic in enumerate(learning_path))
                ),
                'response_type': 'learning_path',
                'additional_data': {'learning_path': learning_path}
            }
        
        else:
            # Check for command-specific queries
            command = get_command_from_input(user_input)
            if command and command in COMMAND_RESPONSES:
                cmd_data = COMMAND_RESPONSES[command]
                response_text = (
                    f"{cmd_data['description']}\n\n"
                    f"Syntax: {cmd_data['syntax']}\n\n"
                    f"Common Options:\n" + "\n".join(f"• {opt}" for opt in cmd_data['common_options']) + "\n\n"
                    f"Examples:\n" + "\n".join(f"• {ex}" for ex in cmd_data['examples'])
                )
                
                if response_format == 'concise':
                    response_text = format_response(response_text, 'concise')
                
                response = {
                    'response_text': response_text,
                    'response_type': 'command_explanation',
                    'additional_data': {
                        'command': command,
                        'details': cmd_data
                    }
                }
            else:
                # General response
                response = {
                    'response_text': (
                        "I'm here to help you learn Linux/MacOS commands! "
                        "You can ask me about specific commands, request examples, "
                        "or get started with basic tutorials. What would you like to know?"
                    ),
                    'response_type': 'general'
                }

        # Store conversation history
        db.chatbot_conversations.update_one(
            {'conversation_id': conversation_id},
            {
                '$push': {
                    'messages': {
                        'user_input': user_input,
                        'response': response['response_text'],
                        'intent': intent,
                        'timestamp': datetime.utcnow()
                    }
                },
                '$setOnInsert': {'created_at': datetime.utcnow()},
                '$set': {'last_updated': datetime.utcnow()}
            },
            upsert=True
        )

        return {
            **response,
            'conversation_id': conversation_id
        }

    except Exception as e:
        logger.error(f"Error generating response: {str(e)}")
        return {
            'response_text': (
                "I apologize, but I encountered an error processing your request. "
                "Please try asking in a different way or ask about another topic."
            ),
            'response_type': 'error',
            'conversation_id': conversation_id
        }

def get_related_commands(command: str) -> List[str]:
    """Get related commands for a given command"""
    if command in COMMAND_RESPONSES:
        return COMMAND_RESPONSES[command].get('related_commands', [])
    return []

def get_command_tips(command: str) -> List[str]:
    """Get tips for a given command"""
    if command in COMMAND_RESPONSES:
        return COMMAND_RESPONSES[command].get('tips', [])
    return []

def get_command_warnings(command: str) -> List[str]:
    """Get warnings for a given command"""
    if command in COMMAND_RESPONSES:
        return COMMAND_RESPONSES[command].get('warnings', [])
    return []
