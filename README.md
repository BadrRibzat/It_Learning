# IT Learning Platform (Backend & Frontend)

[![Python 3.12](https://img.shields.io/badge/python-3.12-blue.svg)](https://www.python.org/downloads/)
[![Flask](https://img.shields.io/badge/Flask-3.0.2-green.svg)](https://flask.palletsprojects.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-blue.svg)](https://www.mongodb.com/atlas)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.3.4-brightgreen.svg)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4.6-yellow.svg)](https://vitejs.dev/)

## 🚀 Tech Stack

### Backend Core Components
- **Framework**: Flask 3.0.2
- **Language**: Python 3.12
- **Database**: MongoDB Atlas
- **Cache**: Redis
- **ML/NLP**: spaCy 3.8.4

### Frontend Core Components
- **Framework**: Vue.js 3.3.4
- **Build Tool**: Vite 4.4.6
- **Styling**: Tailwind CSS 3.3.3
- **State Management**: Vuex 4.1.0
- **Routing**: Vue Router 4.2.4
- **HTTP Client**: Axios 1.4.0

### Key Features
- JWT Authentication
- Redis-based Session Management
- ML-powered Chatbot
- Interactive Lesson System
- Command-line Skill Tracking
- Progress Analytics
- Responsive Frontend with Tailwind CSS
- Vue.js Components for Modularity
- Real-time Progress Tracking with Charts

### Services
- Authentication Service
- Lesson Management
- Chatbot Service (ML/NLP)
- Level Progression System
- User Progress Tracking
- Frontend API Integration

## 📦 Project Structure

### Backend Structure
```
.
├── authentication/            # Auth endpoints and logic
├── chatbot/                   # ML-powered chatbot
│   └── scripts/               # Training/population scripts
├── lessons/                   # Lesson management
├── services/                  # Business logic services
├── user_profile/              # User profile management
├── utils/                     # Shared utilities
├── config.py                  # Configuration loader
├── docker-compose.yml         # Docker setup
├── Dockerfile                 # Container configuration
├── requirements.txt           # Dependencies
└── run.py                     # Entry point
```

### Frontend Structure
```
.
├── public/                    # Static assets
│   └── favicon.ico            # Favicon
├── src/                       # Source code
│   ├── assets/                # Assets (CSS, images, etc.)
│   │   ├── css/               # CSS files
│   │   │   └── main.css       # Main CSS file
│   │   └── logo.svg           # Logo
│   ├── components/            # Vue components
│   │   ├── auth/              # Authentication components
│   │   │   ├── LoginForm.vue
│   │   │   ├── LogoutButton.vue
│   │   │   └── RegisterForm.vue
│   │   ├── common/            # Common components
│   │   │   ├── ChatBot.vue
│   │   │   ├── FlashcardDemo.vue
│   │   │   ├── Footer.vue
│   │   │   ├── Header.vue
│   │   │   ├── LanguageSwitcher.vue
│   │   │   ├── Notification.vue
│   │   │   └── Sidebar.vue
│   │   ├── lessons/           # Lesson-related components
│   │   │   ├── FlashcardsComponent.vue
│   │   │   ├── LessonsComponent.vue
│   │   │   ├── LevelTestComponent.vue
│   │   │   └── QuizComponent.vue
│   │   ├── Notes/             # Note-related components
│   │   │   ├── NoteForm.vue
│   │   │   ├── NoteList.vue
│   │   │   └── NoteSearch.vue
│   │   ├── profile/           # Profile components
│   │   │   └── ProfileComponent.vue
│   │   └── progress/          # Progress tracking components
│   │       ├── ProgressCircle.vue
│   │       └── StatisticsChart.vue
│   ├── router/                # Vue Router configuration
│   │   └── index.js
│   ├── services/              # API services
│   │   └── api/
│   │       ├── apiClient.js
│   │       ├── AuthService.js
│   │       ├── ChatbotService.js
│   │       ├── LessonService.js
│   │       ├── ProfileService.js
│   │       └── ProgressService.js
│   ├── store/                 # Vuex store
│   │   ├── index.js
│   │   └── modules/
│   │       ├── auth.js
│   │       ├── chatbot.js
│   │       ├── lessons.js
│   │       ├── profile.js
│   │       └── progress.js
│   ├── utils/                 # Utility functions
│   │   └── NotificationService.js
│   ├── views/                 # Vue views
│   │   ├── auth/              # Authentication views
│   │   │   ├── LoginView.vue
│   │   │   └── RegisterView.vue
│   │   ├── lessons/           # Lesson views
│   │   │   ├── FlashcardsView.vue
│   │   │   ├── LessonsView.vue
│   │   │   ├── LevelTestView.vue
│   │   │   └── QuizView.vue
│   │   ├── public/            # Public views
│   │   │   ├── AboutView.vue
│   │   │   ├── ContactView.vue
│   │   │   ├── FeaturesView.vue
│   │   │   └── HomeView.vue
│   │   └── user/              # User views
│   │       ├── NotesView.vue
│   │       └── ProfileView.vue
│   ├── App.vue                # Main Vue component
│   └── main.js                # Entry point
├── tailwind.config.js         # Tailwind CSS configuration
├── vite.config.js             # Vite configuration
├── eslint.config.js           # ESLint configuration
├── postcss.config.js          # PostCSS configuration
├── jsconfig.json              # JS configuration
├── package.json               # Project dependencies
└── README.md                  # Project documentation
```

## 🛠️ Installation & Setup

### Backend Prerequisites
- Python 3.12
- MongoDB Atlas cluster
- Redis 6.2+
- Docker (optional)

### Frontend Prerequisites
- Node.js 18+
- npm or yarn

### Backend Local Setup
```bash
python -m venv env
source env/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Environment Variables
# Create .env file:
SECRET_KEY=your_secret_key
DEBUG=True
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/dbname
REDIS_HOST=localhost
REDIS_PORT=6379
ML_MODEL_PATH=en_core_web_sm

# Docker Setup
docker-compose up --build

# Populate Initial Data
python chatbot/scripts/populate_chatbot.py
python lessons/scripts/populate_data.py
```

### Frontend Local Setup
```bash
cd learn-cmd
npm install
npm run dev
```

### Kubernetes Deployment (Backend)
```bash
minikube start --cpus 2 --memory 2200 --disk-size 20g
minikube addons enable ingress
eval $(minikube docker-env)
docker build -t it-learn-app:latest .
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/redis-deployment.yaml
kubectl apply -f k8s/redis-service.yaml
kubectl apply -f k8s/app-deployment.yaml
kubectl apply -f k8s/app-service.yaml
kubectl apply -f k8s/app-ingress.yaml
minikube tunnel
```

### Testing Backend Deployment
```bash
kubectl get pods -n e-learn -w
kubectl get all -n e-learn
MINIKUBE_IP=$(minikube ip)
curl http://$MINIKUBE_IP/healthcheck
```

## 📚 API Documentation
Access Swagger UI after starting the server:
[![swagger](http://localhost:5000/docs)]

## 🧪 Testing
```bash
# Backend Tests
pytest test_*.py -v

# Frontend Tests (if applicable)
npm run test
```

## 🚀 Deployment
```bash
# Production build (Backend)
docker-compose -f docker-compose.yml up --build -d

# Frontend Production Build
npm run build
```

## 🤖 ML Chatbot Features
- Natural Language Processing with spaCy
- Context-aware responses
- IT command-line tutoring
- Progress-aware recommendations

## 🔒 Security
- JWT Authentication
- Redis session store
- Password hashing
- Rate limiting
- Input validation

## 📈 Monitoring
```bash
# Check Redis health
docker exec -it it-learn-redis redis-cli ping

# View logs
docker-compose logs -f app
```

## 📄 License
MIT License

## 📧 Contact
Badr Ribzat - badrribzat@gmail.com


