from flask_restx import Namespace, Resource, fields
from utils.exceptions import AppError
from .utils import generate_chat_response

chatbot_ns = Namespace('chatbot', description='Chatbot operations')

chatbot_model = chatbot_ns.model('ChatbotInput',{
    'input': fields.String(required=True, description='User Input'),
})

@chatbot_ns.route('/chatbot')
class Chatbot(Resource):
    @chatbot_ns.expect(chatbot_model)
    def post(self):
        """Chatbot endpoint"""
        data = chatbot_ns.payload
        user_input = data.get('input')
        
        if not user_input:
            raise AppError("Input is required", 400)
            
        response = generate_chat_response(user_input)
        return {"response_text": response}, 200
