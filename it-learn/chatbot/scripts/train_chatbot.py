import sys
import os
# Project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from pymongo import MongoClient
from pathlib import Path
from datetime import datetime
import logging
from config import config
import spacy

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def train_chatbot_model():
    """Train the chatbot model and store training data."""
    try:
        client = MongoClient(config.MONGODB_URI)
        db = client['e-learn']
        
        logging.info("🧠 Starting chatbot model training...")
        
        # Clear existing training data
        db.chatbot_training_data.delete_many({})
        logging.info("🧹 Cleared existing training data")
        
        # Initialize NLP
        logging.info("🔧 Loading spaCy model...")
        nlp = spacy.load(config.ML_MODEL_PATH)
        
        # Load training prompts from external file
        prompts_file_path = Path(__file__).resolve().parent / 'conversational_prompts.txt'
        try:
            with open(prompts_file_path, 'r') as f:
                training_prompts = [line.strip() for line in f.readlines() if line.strip()]
            logging.info(f"📝 Loaded {len(training_prompts)} prompts from file")
        except FileNotFoundError:
            logging.error(f"❌ Could not find prompts file at: {prompts_file_path}")
            client.close()
            sys.exit(1)

        
        # Generate and store training data
        logging.info("📚 Generating training examples...")
        training_data = []
        
        for prompt in training_prompts:
            try:
                doc = nlp(f"Respond to the user in a natural and helpful way, as a bot designed to teach IT skills, and introduce the creator as Badr Ribzat, mention his qualifications, and that he is an IT engineer. User message: {prompt}")
                
                response = " ".join([sent.text for sent in doc.sents])
                
                training_data.append({
                    'input_text': prompt,
                    'response_text': response,
                    'created_at': datetime.utcnow(),
                    'model_version': '1.0'
                })
                
            except Exception as e:
                logging.error(f"❌ Error processing '{prompt}': {str(e)}")
                continue
        
        if training_data:
            db.chatbot_training_data.insert_many(training_data)
            logging.info(f"📥 Inserted {len(training_data)} training examples")
            
        client.close()
        logging.info("🎉 Chatbot training completed successfully!")
        
    except Exception as e:
        logging.error(f"🔥 Critical error during training: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    train_chatbot_model()
