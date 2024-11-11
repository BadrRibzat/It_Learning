import os
import sys

# Add the project root directory to Python path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()

import spacy
from spacy.training import Example
from chatbot.prepare_data import prepare_training_data

def train_model():
    # Use a more recent spaCy model
    nlp = spacy.load("en_core_web_sm")
    
    # Add text categorization pipeline
    if 'textcat' not in nlp.pipe_names:
        textcat = nlp.add_pipe("textcat")
    else:
        textcat = nlp.get_pipe("textcat")

    # Prepare training data
    training_data = prepare_training_data()
    
    # Add labels
    for _, label in training_data:
        if label not in textcat.labels:
            textcat.add_label(label)

    # Convert training data to spaCy format
    train_examples = []
    for text, label in training_data:
        doc = nlp.make_doc(text)
        example = Example.from_dict(doc, {"cats": {label: 1.0}})
        train_examples.append(example)

    # Training
    optimizer = nlp.begin_training()
    for i in range(20):  # Increased epochs
        losses = {}
        nlp.update(train_examples, sgd=optimizer, losses=losses)
        print(f"Losses after epoch {i+1}: {losses}")

    # Save the trained model
    nlp.to_disk("chatbot/model")
    print("Model training completed and saved.")

if __name__ == "__main__":
    train_model()
