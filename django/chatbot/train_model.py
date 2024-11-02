import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

import spacy
from spacy.training import Example
from chatbot.prepare_data import prepare_training_data

def train_model():
    nlp = spacy.blank("en")
    textcat = nlp.add_pipe("textcat")

    training_data = prepare_training_data()
    examples = []
    for text, label in training_data:
        doc = nlp.make_doc(text)
        example = Example.from_dict(doc, {"cats": {"response": label}})
        examples.append(example)

    optimizer = nlp.initialize()
    for i in range(10):
        losses = {}
        for example in examples:
            nlp.update([example], sgd=optimizer, losses=losses)
        print(f"Losses after epoch {i+1}: {losses}")

    nlp.to_disk("chatbot/model")

if __name__ == "__main__":
    train_model()
