import sys
import os
from datetime import datetime
from pathlib import Path
import logging
from typing import List, Dict
from pymongo import MongoClient
from config import config
from .command_responses import COMMAND_RESPONSES, CONVERSATION_PATTERNS, LEARNING_PATHS

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ChatbotTrainer:
    def __init__(self):
        self.client = MongoClient(config.MONGODB_URI)
        self.db = self.client['e-learn']
        
    def generate_training_data(self) -> List[Dict]:
        """Generate training data from predefined responses"""
        training_data = []
        
        # Add command responses
        for command, data in COMMAND_RESPONSES.items():
            training_data.append({
                'type': 'command',
                'command': command,
                'data': data,
                'created_at': datetime.utcnow(),
                'model_version': '1.0'
            })
        
        # Add conversation patterns
        for intent, responses in CONVERSATION_PATTERNS.items():
            training_data.append({
                'type': 'conversation',
                'intent': intent,
                'responses': responses,
                'created_at': datetime.utcnow(),
                'model_version': '1.0'
            })
        
        # Add learning paths
        for level, path in LEARNING_PATHS.items():
            training_data.append({
                'type': 'learning_path',
                'level': level,
                'content': path,
                'created_at': datetime.utcnow(),
                'model_version': '1.0'
            })
        
        return training_data

    def train(self):
        """Train the chatbot with predefined responses"""
        try:
            logger.info("Starting chatbot training...")
            
            # Clear existing data
            self.db.chatbot_training.delete_many({})
            logger.info("Cleared existing training data")
            
            # Generate and store new training data
            training_data = self.generate_training_data()
            if training_data:
                self.db.chatbot_training.insert_many(training_data)
                logger.info(f"Inserted {len(training_data)} training examples")
            
            logger.info("Training completed successfully!")
            
        except Exception as e:
            logger.error(f"Error during training: {str(e)}")
            raise
        finally:
            self.client.close()

def main():
    trainer = ChatbotTrainer()
    trainer.train()

if __name__ == "__main__":
    main()
