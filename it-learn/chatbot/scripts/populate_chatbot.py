import sys
import os
from datetime import datetime
from pathlib import Path
import logging
from typing import List, Dict
from pymongo import MongoClient
from config import config
from .command_responses import COMMAND_RESPONSES, LEARNING_PATHS

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ChatbotPopulator:
    def __init__(self):
        self.client = MongoClient(config.MONGODB_URI)
        self.db = self.client['e-learn']

    def populate_command_content(self) -> List[Dict]:
        """Populate detailed command information"""
        content = []
        for command, data in COMMAND_RESPONSES.items():
            content.append({
                'command': command,
                'data': data,
                'type': 'command_info',
                'created_at': datetime.utcnow()
            })
        return content

    def populate_learning_paths(self) -> List[Dict]:
        """Populate learning path content"""
        content = []
        for level, paths in LEARNING_PATHS.items():
            for path in paths:
                content.append({
                    'level': level,
                    'topic': path['topic'],
                    'content': path,
                    'type': 'tutorial',
                    'created_at': datetime.utcnow()
                })
        return content

    def populate(self):
        """Main population process"""
        try:
            logger.info("Starting chatbot content population...")
            
            # Clear existing content
            self.db.chatbot_content.delete_many({})
            logger.info("Cleared existing content")
            
            # Populate command content
            command_content = self.populate_command_content()
            if command_content:
                self.db.chatbot_content.insert_many(command_content)
                logger.info(f"Inserted {len(command_content)} command entries")
            
            # Populate learning paths
            learning_content = self.populate_learning_paths()
            if learning_content:
                self.db.chatbot_content.insert_many(learning_content)
                logger.info(f"Inserted {len(learning_content)} learning path entries")
            
            logger.info("Population completed successfully!")
            
        except Exception as e:
            logger.error(f"Error during population: {str(e)}")
            raise
        finally:
            self.client.close()

def main():
    populator = ChatbotPopulator()
    populator.populate()

if __name__ == "__main__":
    main()
