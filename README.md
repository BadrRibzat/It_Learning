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
├── authentication/ # Auth endpoints and logic
├── chatbot/ # ML-powered chatbot
│   └── scripts/ # Training/population scripts
├── lessons/ # Lesson management
├── services/ # Business logic services
├── user_profile/ # User profile management
├── utils/ # Shared utilities
├── config.py # Configuration loader
├── docker-compose.yml # Docker setup
├── Dockerfile # Container configuration
├── requirements.txt # Dependencies
└── run.py # Entry point

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


