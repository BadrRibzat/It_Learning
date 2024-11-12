import os
import sys
import numpy as np
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.multiclass import OneVsRestClassifier
from sklearn.svm import LinearSVC

# Add the project root directory to Python path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()

from chatbot.prepare_data import prepare_training_data

def download_resources():
    """
    Download necessary resources
    """
    try:
        import nltk
        nltk.download('punkt', quiet=True)
        nltk.download('wordnet', quiet=True)
        nltk.download('averaged_perceptron_tagger', quiet=True)
        print("Resources downloaded successfully.")
    except Exception as e:
        print(f"Error downloading resources: {e}")

def train_model():
    try:
        # Download resources first
        download_resources()
        
        # Prepare training data
        training_data = prepare_training_data()
        
        # Separate texts and labels
        texts = [text for text, _ in training_data]
        labels = [label for _, label in training_data]
        
        # Create vectorizer
        vectorizer = TfidfVectorizer(
            stop_words='english', 
            max_features=5000
        )
        
        # Transform texts to feature vectors
        X = vectorizer.fit_transform(texts)
        
        # Encode labels
        label_encoder = LabelEncoder()
        y = label_encoder.fit_transform(labels)
        
        # Create and train classifier
        classifier = OneVsRestClassifier(LinearSVC(random_state=42))
        classifier.fit(X, y)
        
        # Ensure model directory exists
        model_dir = os.path.join(os.path.dirname(__file__), 'model')
        os.makedirs(model_dir, exist_ok=True)
        
        # Save the model and vectorizer
        joblib.dump(classifier, os.path.join(model_dir, 'classifier.pkl'))
        joblib.dump(vectorizer, os.path.join(model_dir, 'vectorizer.pkl'))
        joblib.dump(label_encoder, os.path.join(model_dir, 'label_encoder.pkl'))
        
        print("Model training completed and saved.")
        
        return classifier, vectorizer, label_encoder

    except Exception as e:
        print(f"Error during model training: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    train_model()
