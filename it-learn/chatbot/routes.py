from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.exceptions import AppError
from .utils import generate_chat_response
import logging
import uuid

logger = logging.getLogger(__name__)

chatbot_ns = Namespace(
    'chatbot',
    description='''Interactive AI Chatbot API for Linux/MacOS Command Learning

    This API provides a conversational interface for learning Linux/MacOS commands through:
    * Natural language interactions
    * Command explanations and examples
    * Best practices and tips
    * Step-by-step learning guidance
    * Context-aware responses
    '''
)

# Request Model
chatbot_input_model = chatbot_ns.model('ChatbotInput', {
    'input': fields.String(
        required=True,
        description='User message or question',
        example='How do I use the ls command?',
        min_length=1,
        max_length=500
    ),
    'context': fields.String(
        required=False,
        description='Previous conversation ID for context',
        example='conv_123abc'
    ),
    'preferred_format': fields.String(
        required=False,
        description='Response detail level',
        enum=['detailed', 'concise'],
        default='detailed'
    )
})

# Response Models
command_info_model = chatbot_ns.model('CommandInfo', {
    'name': fields.String(description='Command name'),
    'syntax': fields.String(description='Command syntax'),
    'description': fields.String(description='Command description'),
    'options': fields.List(fields.String, description='Common options'),
    'examples': fields.List(fields.String, description='Usage examples'),
    'tips': fields.List(fields.String, description='Usage tips'),
    'warnings': fields.List(fields.String, description='Important warnings'),
    'related': fields.List(fields.String, description='Related commands')
})

learning_info_model = chatbot_ns.model('LearningInfo', {
    'topic': fields.String(description='Learning topic'),
    'steps': fields.List(fields.String, description='Learning steps'),
    'examples': fields.List(fields.String, description='Practice examples'),
    'next_topics': fields.List(fields.String, description='Suggested next topics')
})

chatbot_response_model = chatbot_ns.model('ChatbotResponse', {
    'response_text': fields.String(
        description='Main response message',
        example='The ls command lists directory contents...'
    ),
    'response_type': fields.String(
        description='Type of response',
        enum=['greeting', 'command', 'tutorial', 'help', 'error']
    ),
    'command_info': fields.Nested(
        command_info_model,
        description='Detailed command information if applicable'
    ),
    'learning_info': fields.Nested(
        learning_info_model,
        description='Learning guidance if applicable'
    ),
    'conversation_id': fields.String(
        description='Unique conversation identifier'
    ),
    'suggestions': fields.List(
        fields.String,
        description='Suggested next questions or commands'
    )
})

@chatbot_ns.route('/chat')
class Chatbot(Resource):
    @chatbot_ns.expect(chatbot_input_model)
    @chatbot_ns.response(200, 'Success', chatbot_response_model)
    @chatbot_ns.response(400, 'Validation Error')
    @chatbot_ns.response(500, 'Internal Server Error')
    def post(self):
        """
        Chat with the Linux/MacOS command learning assistant

        Send messages to get help with:
        * Learning specific commands
        * Understanding command syntax
        * Viewing practical examples
        * Following guided tutorials
        * Getting best practices
        * Exploring related concepts

        Examples of things you can ask:
        * "How do I use the ls command?"
        * "I'm new to Linux, where should I start?"
        * "What are the options for cp command?"
        * "Show me examples of mkdir"
        * "What commands are related to file permissions?"
        """
        try:
            # Get and validate input
            data = chatbot_ns.payload
            user_input = data.get('input', '').strip()
            context = data.get('context')
            preferred_format = data.get('preferred_format', 'detailed')

            # Input validation
            if not user_input:
                raise AppError("Please provide a message or question", 400)
            if len(user_input) > 500:
                raise AppError("Message is too long (max 500 characters)", 400)
            if preferred_format not in ['detailed', 'concise']:
                raise AppError("Invalid format (use 'detailed' or 'concise')", 400)

            # Generate response
            response = generate_chat_response(
                user_input,
                context=context,
                response_format=preferred_format
            )

            logger.info(f"Generated response for: {user_input[:50]}...")
            return response, 200

        except AppError as e:
            logger.warning(f"Validation error: {str(e)}")
            return {
                'response_text': str(e),
                'response_type': 'error',
                'conversation_id': str(uuid.uuid4())
            }, e.status_code
        except Exception as e:
            logger.error(f"Error processing request: {str(e)}")
            return {
                'response_text': "I'm having trouble processing your request. Please try again.",
                'response_type': 'error',
                'conversation_id': str(uuid.uuid4())
            }, 500
