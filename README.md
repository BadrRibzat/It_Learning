# Learn-English Project

## Overview
Learn-English is a comprehensive full-stack web application designed to teach English to non-English speakers.
It features a Django backend and a Vue.js frontend, integrated with modern technologies to provide a robust and user-friendly learning platform.

## Project Structure
- **Backend**: Django-based backend responsible for user authentication, lesson management, flashcards, chatbot integration, and more.
- **Frontend**: Vue.js-based frontend that provides an interactive and responsive user interface for learners.

### Directory Layout

```
.
├── django
│   ├── accounts
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── backend
│   │   ├── asgi.py
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── chatbot
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── flashcards
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── lessons
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── __init__.py
│   │   ├── management
│   │   │   └── commands
│   │   │       └── init_db.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── manage.py
│   └── requirements.txt
├── frontend
│   ├── babel.config.js
│   ├── jsconfig.json
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── public
│   │   ├── favicon.ico
│   │   └── index.html
│   ├── README.md
│   ├── src
│   │   ├── App.vue
│   │   ├── assets
│   │   │   └── logo.png
│   │   ├── components
│   │   │   └── HelloWorld.vue
│   │   ├── i18n
│   │   ├── main.js
│   │   ├── router
│   │   ├── store
│   │   └── views
│   ├── tailwind.config.js
│   └── vue.config.js
└── README.md
```

## Technologies Used
### Backend
- **Django**: Web framework used for developing the backend.
- **Django REST Framework**: For building RESTful APIs.
- **Djongo**: Django MongoDB connector.
- **MongoDB**: NoSQL database used for storing user data, lessons, flashcards, etc.

### Frontend
- **Vue.js 3**: Frontend framework used for building the user interface.
- **Vuex**: State management library for Vue.js.
- **Vite.js**: Build tool for modern web applications.
- **TailwindCSS**: Utility-first CSS framework.

## Installation
### Backend Setup
1. **Create a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r django/requirements.txt
   ```

3. **Run initial database setup:**
   Since `Djongo` is used with MongoDB, traditional Django migrations are not required. Instead, ensure the database is correctly set up using the custom management command:
   ```bash
   python django/manage.py init_db
   ```

4. **Start the development server:**
   ```bash
   python django/manage.py runserver
   ```

### Frontend Setup
1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run serve
   ```

## Features
- **User Authentication**: Custom user model with JWT-based authentication.
- **Lessons**: Comprehensive lesson management with categories and progress tracking.
- **Flashcards**: Interactive flashcards for vocabulary building.
- **Chatbot**: Basic keyword-based chatbot for assisting users.
- **Internationalization (i18n)**: Support for multiple languages.
- **Responsive Design**: Tailored for different screen sizes using TailwindCSS.

## Contributing
We welcome contributions from the community.
Please follow the guidelines for contributing and code of conduct.

## License
This project is licensed under the MIT License.

## Contact
For any inquiries or issues, please contact the project maintainer at [badrribzat@gmail.com].
```
