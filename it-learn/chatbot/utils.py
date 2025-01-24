from utils.db import get_db
import spacy
from config import config

nlp = spacy.load(config.ML_MODEL_PATH)

def generate_chat_response(user_input):
    db = get_db()
    exact_match = db.chatbot_response.find_one({'input_text': user_input})
    if exact_match:
        return exact_match['response_text']
    
    doc = nlp(f"Respond naturally about Badr Ribzat's project: {user_input}")
    return " ".join([sent.text for sent in doc.sents])
