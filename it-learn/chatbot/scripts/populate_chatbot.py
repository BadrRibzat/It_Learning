import sys
import os
# Project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from pymongo import MongoClient
from pathlib import Path
import logging
from config import config
import spacy

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def populate_chatbot_responses():
    """Populate chatbot responses in the database."""
    try:
        client = MongoClient(config.MONGODB_URI)
        db = client['e-learn']
        
        logging.info("🚀 Starting chatbot population...")
        
        # Clean existing responses
        db.chatbot_response.delete_many({})
        logging.info("🧹 Cleared existing chatbot responses")
        
        # Initialize NLP
        logging.info("🔧 Loading spaCy model...")
        nlp = spacy.load(config.ML_MODEL_PATH)
        
        # Load conversational prompts from external file
        prompts_file_path = Path(__file__).resolve().parent / 'conversational_prompts.txt'
        try:
            with open(prompts_file_path, 'r') as f:
                conversational_prompts = [line.strip() for line in f.readlines() if line.strip()]
            logging.info(f"📝 Loaded {len(conversational_prompts)} prompts from file")
        except FileNotFoundError:
             logging.error(f"❌ Could not find prompts file at: {prompts_file_path}")
             client.close()
             sys.exit(1)
        
        # Generate and insert responses
        logging.info("🧠 Generating chatbot responses...")
        for prompt in conversational_prompts:
            try:
                doc = nlp(f"Respond to the user in a natural and helpful way, as a bot designed to teach IT skills, and introduce the creator as Badr Ribzat, mention his qualifications, and that he is an IT engineer. User message: {prompt}")
                
                response = " ".join([sent.text for sent in doc.sents])
                
                db.chatbot_response.insert_one({
                    'input_text': prompt,
                    'response_text': response
                })
                logging.info(f"✅ Created response for: '{prompt}'")
                
            except Exception as e:
                logging.error(f"❌ Error processing '{prompt}': {str(e)}")
                continue
        
        client.close()
        logging.info("🎉 Chatbot population completed successfully!")
        
    except Exception as e:
        logging.error(f"🔥 Critical error during population: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    populate_chatbot_responses()
