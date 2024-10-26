Learn English Django Backend
This is the backend for the Learn English application, built using Django and Django REST Framework. It provides the necessary APIs for user management, lesson management, chatbot interactions, and more.

Table of Contents
Features

Project Structure

Setup

Configuration

Running the Server

Testing

API Endpoints

Contributing

License

Features
User Management: Register, login, logout, and manage user profiles.

Lesson Management: Create, retrieve, and update lessons.

Chatbot: Interact with an authenticated and anonymous chatbot.

Authentication: JWT-based authentication with token refresh and blacklist.

Internationalization: Support for multiple languages.

Rate Limiting: Throttling for API endpoints.

Email Notifications: Password reset and other email notifications.

OAuth2: Google OAuth2 integration for authentication.

Project Structure
django/
├── accounts/
│   ├── admin.py
│   ├── apps.py
│   ├── exceptions.py
│   ├── __init__.py
│   ├── management/
│   │   └── commands/
│   │       └── populate_accounts.py
│   ├── migrations/
│   │   ├── 0001_initial.py
│   │   ├── 0002_initial.py
│   │   └── __init__.py
│   ├── models.py
│   ├── permissions.py
│   ├── serializers.py
│   ├── tasks.py
│   ├── test_accounts.py
│   ├── tests.py
│   ├── urls.py
│   ├── utils.py
│   └── views.py
├── backend/
│   ├── asgi.py
│   ├── celery.py
│   ├── google_oauth2_credentials.json
│   ├── __init__.py
│   ├── settings.py
│   ├── test_settings.py
│   ├── urls.py
│   └── wsgi.py
├── chatbot/
│   ├── admin.py
│   ├── apps.py
│   ├── __init__.py
│   ├── management/
│   │   └── commands/
│   │       └── populate_chatbot.py
│   ├── migrations/
│   │   ├── 0001_initial.py
│   │   └── __init__.py
│   ├── models.py
│   ├── serializers.py
│   ├── test_chatbot.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
├── conftest.py
├── debug.log
├── htmlcov/
├── lessons/
│   ├── admin.py
│   ├── apps.py
│   ├── __init__.py
│   ├── management/
│   │   └── commands/
│   │       ├── init_db.py
│   │       └── populate_lessons.py
│   ├── migrations/
│   │   ├── 0001_initial.py
│   │   └── __init__.py
│   ├── models.py
│   ├── serializers.py
│   ├── templates/
│   │   └── admin/
│   │       └── custom_lesson_view.html
│   ├── test_lessons.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
├── manage.py
├── media/
├── pytest.ini
├── pytest_results.xml
├── report.xml
├── requirements.txt
├── templates/
│   └── password_reset_email.html
├── test_endpoints.sh
├── test_results.xml
└── tests/
    ├── __init__.py
    └── test_manage.py

Setup
Prerequisites
Python 3.10

PostgreSQL

Redis (for Celery)

Virtualenv (optional but recommended)

Installation
Clone the repository:
git clone https://github.com/badrribzat/Learn_English.git
cd Learn_English

Create a virtual environment and activate it:
python3 -m venv env
source env/bin/activate

Install dependencies:
pip install -r django/requirements.txt

Set up the database:

Create a PostgreSQL database and user.

Update the .env file with your database credentials.

Apply migrations:
python django/manage.py migrate

Create a superuser:
python django/manage.py createsuperuser

Configuration
Environment Variables

Create a .env file in the django directory with the following content. 
Replace the placeholders with your actual values:
SECRET_KEY=<your_secret_key>
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
FRONTEND_URL=http://localhost:3000
DB_NAME=<your_database_name>
DB_USER=<your_database_user>
DB_PASSWORD=<your_database_password>
DB_HOST=localhost
DB_PORT=5432
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=<your_email_host_user>
EMAIL_HOST_PASSWORD=<your_email_host_password>
GOOGLE_OAUTH2_CLIENT_ID=<your_google_oauth2_client_id>
GOOGLE_OAUTH2_CLIENT_SECRET=<your_google_oauth2_client_secret>
GOOGLE_OAUTH2_REDIRECT_URI=http://localhost:8000/oauth2callback/
DJANGO_SECRET_KEY=<your_django_secret_key>

Running the Server
Start the Django development server:
python django/manage.py runserver

Access the admin interface:

Open your browser and go to http://localhost:8000/admin/.

Testing
Running Tests
Run all tests:
pytest django/

Run specific tests:
pytest django/tests/test_manage.py

Test Endpoints
You can use the test_endpoints.sh script to test various API endpoints:
./django/test_endpoints.sh

API Endpoints
Authentication
POST /api/register/ - Register a new user.

POST /api/login/ - Login and get JWT tokens.

POST /api/logout/ - Logout and blacklist tokens.

POST /api/token/refresh/ - Refresh JWT access token.

User Management
GET /api/profile/ - Get user profile.

GET /api/statistics/ - Get user statistics.

POST /api/upload-profile-picture/ - Upload profile picture.

POST /api/password-reset/ - Request password reset.

Lesson Management
GET /api/lessons/ - Get all lessons.

GET /api/lessons/{id}/ - Get a specific lesson.

POST /api/update-current-lesson/ - Update current lesson.

Chatbot
POST /api/chatbot/ - Interact with the chatbot.

Other Endpoints
GET /api/levels/ - Get all levels.

GET /api/quizzes/ - Get all quizzes.

GET /api/flashcards/ - Get flashcards for a lesson.

POST /api/user-flashcard-progress/ - Submit flashcard progress.

POST /api/user-quiz-attempts/ - Submit quiz attempt.

POST /api/level-test-submit/{id}/ - Submit level test.

POST /api/notes/ - Create a note.

GET /api/notes/ - Get all notes.

PUT /api/notes/{id}/ - Update a note.

DELETE /api/notes/{id}/ - Delete a note.

GET /api/user-progress/ - Get user progress.

POST /api/reset-progress/ - Reset user progress.

Contributing
Contributions are welcome! Please read the contributing guidelines before getting started.

License
This project is licensed under the MIT License. See the LICENSE file for details.

development process still in progress for the frontend

