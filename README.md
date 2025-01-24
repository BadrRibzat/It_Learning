# IT Learning Platform (Backend)

[![Python 3.12](https://img.shields.io/badge/python-3.12-blue.svg)](https://www.python.org/downloads/)
[![Flask](https://img.shields.io/badge/Flask-3.0.2-green.svg)](https://flask.palletsprojects.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-blue.svg)](https://www.mongodb.com/atlas)

## 🚀 Tech Stack

### Core Components
- **Framework**: Flask 3.0.2
- **Language**: Python 3.12
- **Database**: MongoDB Atlas
- **Cache**: Redis
- **ML/NLP**: spaCy 3.8.4

### Key Features
- JWT Authentication
- Redis-based Session Management
- ML-powered Chatbot
- Interactive Lesson System
- Command-line Skill Tracking
- Progress Analytics

### Services
- Authentication Service
- Lesson Management
- Chatbot Service (ML/NLP)
- Level Progression System
- User Progress Tracking

## 📦 Project Structure
.
├── authentication
│   ├── __init__.py
│   ├── routes.py
│   ├── schemas.py
│   └── utils.py
├── chatbot
│   ├── __init__.py
│   ├── routes.py
│   ├── schemas.py
│   ├── scripts
│   │   ├── conversational_prompts.txt
│   │   ├── populate_chatbot.py
│   │   └── train_chatbot.py
│   └── utils.py
├── config.py
├── docker-compose.yml
├── Dockerfile
├── __init__.py
├── lessons
│   ├── __init__.py
│   ├── routes.py
│   ├── schemas.py
│   ├── scripts
│   │   └── populate_data.py
│   └── utils.py
├── pytest.ini
├── README.md
├── requirements.txt
├── run.py
├── services
│   ├── __init__.py
│   ├── level_service.py
│   ├── ml_service.py
│   └── progress_service.py
├── test_auth.py
├── test_chatbot.py
├── test_lessons.py
├── test_profile.py
├── user_profile
│   ├── __init__.py
│   ├── profile_routes.py
│   ├── schemas.py
│   └── utils.py
└── utils
    ├── api_config.py
    ├── auth.py
    ├── db.py
    ├── exceptions.py
    ├── __init__.py
    └── redis_cache.py


## 🛠️ Installation & Setup

### Prerequisites
- Python 3.12
- MongoDB Atlas cluster
- Redis 6.2+
- Docker (optional)

### Local Setup
```bash
python -m venv env
source env/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm

Environment Variables
Create .env file:
```bash
SECRET_KEY=your_secret_key
DEBUG=True
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/dbname
REDIS_HOST=localhost
REDIS_PORT=6379
ML_MODEL_PATH=en_core_web_sm

Docker Setup
```bash
docker-compose up --build

Populate Initial Data
```bash
python chatbot/scripts/populate_chatbot.py
python lessons/scripts/populate_data.py

📚 API Documentation
Access Swagger UI after starting the server:
[![swagger](http://localhost:5000/docs)]

🧪 Testing
```bash
pytest test_*.py -v

🚀 Deployment
```bash
# Production build
docker-compose -f docker-compose.yml up --build -d

# Scale services
docker-compose scale app=3 redis=2

🤖 ML Chatbot Features
Natural Language Processing with spaCy

Context-aware responses

IT command-line tutoring

Progress-aware recommendations

🔒 Security
JWT Authentication

Redis session store

Password hashing

Rate limiting

Input validation

📈 Monitoring
```bash
# Check Redis health
docker exec -it it-learn-redis redis-cli ping

# View logs
docker-compose logs -f app
📄 License
MIT License

📧 Contact
Badr Ribzat - badrribzat@gmail.com


