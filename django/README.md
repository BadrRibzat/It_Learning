# Learn English Platform

A comprehensive Django-based REST API for an English learning platform with features like user management, lesson progression, flashcards, quizzes, and an AI chatbot.

## 🚀 Features

- **User Management**
  - JWT Authentication
  - Email Verification
  - Password Reset
  - Multi-Factor Authentication
  - Profile Management
  - Google OAuth2 Integration

- **Learning System**
  - Progressive Level System
  - Flashcards
  - Quizzes
  - Level Tests
  - Progress Tracking
  - Personalized Learning Path

- **Notes System**
  - CRUD Operations
  - Search Functionality
  - Categorization (General, Vocabulary, Grammar)

- **AI Chatbot**
  - Natural Language Processing
  - Contextual Responses
  - Learning Assistance

- **Internationalization**
  - Multi-language Support (EN, AR, FR, DE, ES, KO, JA, ZH)

## 🛠️ Tech Stack

- **Backend Framework**: Django 4.2.7
- **API Framework**: Django REST Framework 3.15.2
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Database**: PostgreSQL
- **AI/ML**: 
  - spaCy 3.5.3
  - scikit-learn
  - PyTorch 2.1.1
  - Transformers 4.35.2
- **Documentation**: drf-yasg (Swagger/OpenAPI)
- **Testing**: pytest, pytest-django, pytest-cov
- **Code Quality**: flake8, black

## 📋 Prerequisites

- Python 3.8+
- PostgreSQL
- Virtual Environment
- Gmail Account (for email services)

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Learn_English/django
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv env
   source env/bin/activate  # Linux/Mac
   # or
   .\env\Scripts\activate  # Windows
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   python -m spacy download en_core_web_sm
   ```

4. **Environment Setup**
   Create a .env file with the following configurations:
   ```env
   SECRET_KEY=your_secret_key
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   FRONTEND_URL=http://localhost:3000
   
   # Database
   DB_NAME=learn_english_db
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   DB_PORT=5432
   
   # Email
   EMAIL_HOST_USER=your_gmail
   EMAIL_HOST_PASSWORD=your_app_password
   DEFAULT_FROM_EMAIL=your_gmail
   
   # Google OAuth2
   GOOGLE_OAUTH2_CLIENT_ID=your_client_id
   GOOGLE_OAUTH2_CLIENT_SECRET=your_client_secret
   GOOGLE_OAUTH2_REDIRECT_URI=http://localhost:8000/oauth2callback/
   ```

5. **Database Setup**
   ```bash
   python manage.py migrate
   ```

6. **Create Superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Populate Initial Data**
   ```bash
   python manage.py populate_lessons
   python manage.py populate_accounts
   python manage.py populate_chatbot
   ```

8. **Train Chatbot Model**
   ```bash
   python train_chatbot.py
   ```

## 🚀 Running the Application

1. **Start the Development Server**
   ```bash
   python manage.py runserver
   ```

2. **Access the APIs**
   - API Root: http://localhost:8000/
   - Admin Interface: http://localhost:8000/admin/
   - API Documentation: http://localhost:8000/swagger/
   - API Documentation: http://localhost:8000/redoc/

## 🧪 Testing

1. **Run All Tests**
   ```bash
   python manage.py test
   ```

2. **Run Specific Test**
   ```bash
   python manage.py test accounts.tests
   ```

3. **Run Test Coverage**
   ```bash
   pytest --cov
   ```

4. **Test Endpoints**
   ```bash
   ./test_endpoints.sh
   ```

## 📚 API Documentation

### Main Endpoints

- **Authentication**
  - POST /accounts/register/
  - POST /accounts/login/
  - POST /accounts/logout/
  - POST /accounts/verify-email/
  - POST /accounts/password-reset/

- **User Management**
  - GET/PUT /accounts/profile/
  - POST /accounts/upload-profile-picture/
  - POST /accounts/mfa/setup/

- **Learning System**
  - GET /lessons/levels/
  - GET /lessons/lessons/
  - POST /lessons/flashcards/submit-answer/
  - POST /lessons/quizzes/submit-quiz/
  - POST /lessons/level-tests/submit-test/

- **Notes System**
  - GET/POST /accounts/notes/
  - GET /accounts/notes/search/
  - PUT/DELETE /accounts/notes/{id}/

- **Chatbot**
  - POST /chatbot/chatbot/

## 🔐 Security Features

- JWT Authentication
- Rate Limiting
- CORS Configuration
- Password Validation
- Email Verification
- Multi-Factor Authentication

## 📝 Logging

Logging is configured for:
- Django System Logs
- Application Logs
- Security Events
- Error Tracking

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details

## Contact-Me:
====Email: badrribzat@gmail.com
