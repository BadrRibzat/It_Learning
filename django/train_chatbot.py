import os
import sys

# Ensure the virtual environment's Python is used
if __name__ == "__main__":
    # Add the project root to Python path
    project_root = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, project_root)

    # Set up Django environment
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    import django
    django.setup()

    # Import the training function
    from chatbot.train_model import train_model

    # Run the training
    train_model()
