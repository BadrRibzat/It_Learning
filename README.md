# Learn English Platform

## 🌟 Project Overview
An advanced, AI-powered language learning platform designed to help users improve their English skills through interactive lessons, flashcards, and an intelligent chatbot.

## 🚀 Tech Stack

### Backend
- **Framework**: Django 5.1.3
- **Language**: Python 3.10
- **Database**: PostgreSQL
- **ORM**: Django ORM

### Authentication
- JWT Authentication
- Simple JWT
- Email Verification

### Machine Learning
- Spacy 3.8.2 (NLP)
- scikit-learn
- NLTK
- Custom ML Chatbot Model

### API
- Django REST Framework
- Swagger/OpenAPI Documentation
- CORS Support

### Testing
- Pytest
- Pytest Django
- Coverage

### Natural Language Processing
- Spacy English Model
- NLTK
- Custom Language Processing

## 🌈 Key Features

1. **User Management**
   - Registration with email verification
   - Profile customization
   - Progress tracking

2. **Learning Modules**
   - Adaptive lesson system
   - Interactive flashcards
   - Quiz-based learning

3. **AI Chatbot**
   - Contextual language interactions
   - ML-powered responses
   - Language detection

## 🔧 Setup & Installation

### Prerequisites
- Python 3.10+
- PostgreSQL
- Virtual Environment

### Installation Steps
1. Clone the repository
2. Create virtual environment
   ```
   python -m venv env
   source env/bin/activate
   ```
3. Install dependencies
   ```
   pip install -r requirements.txt
   ```
4. Set up environment variables
5. Run migrations
   ```
   python manage.py migrate
   ```
6. Start development server
   ```
   python manage.py runserver
   ```

## 🧪 Testing

Run comprehensive test suite:
```
pytest
```
### Test Coverage
- Endpoint Testing
- Model Validation
- API Interactions

## 🔒 Security Features
- JWT Token Authentication
- Password Hashing
- Email Verification
- Secure User Management

## 📦 Environment Configuration
Create a `.env` file with the following structure:
```
SECRET_KEY=your_secret_key
DEBUG=True/False
DATABASE_URL=postgresql://username:password@host:port/dbname
EMAIL_HOST_USER=your_email
EMAIL_HOST_PASSWORD=your_email_password
FRONTEND_URL=http://localhost:3000
```

## 📝 API Documentation
- Swagger UI: `/swagger/`
- ReDoc: `/redoc/`

## 🌍 Internationalization
- Multi-language support
- Language preference settings

## 🚧 Future Roadmap
- Advanced ML Models
- More Interactive Lessons
- Gamification Features
- Social Learning Components

## 👥 Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License
[]

## 🤝 Contact
[Full-Name: Badr Ribzat
 Email: badrribzat@gmail.com]
