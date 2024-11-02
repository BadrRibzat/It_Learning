from .models import ChatbotResponse

def prepare_training_data():
    responses = ChatbotResponse.objects.all()
    data = [(response.input_text, response.response_text) for response in responses]
    return data
