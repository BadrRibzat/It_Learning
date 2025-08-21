# IT-Learning: CLI Mastery Platform

A modern MERN stack application designed to help developers master command-line interfaces through interactive flashcards and Q&A sessions. Built by a self-taught developer to bridge the gap between tutorial knowledge and real-world engineering confidence.

## 🚀 Features

### ✨ Core Functionality
- **Interactive Flashcards**: Learn CLI commands through engaging flashcard sessions
- **Q&A Mode**: Test conceptual understanding with detailed explanations
- **Progress Tracking**: Visual progress indicators and mastery levels
- **Tech Stack Selection**: Choose from 11 essential technologies
- **Smart Answer Validation**: Flexible input recognition with alias support

### 🌍 Enhanced User Experience
- **Multi-Language Support**: Available in 5 languages (English, Arabic, French, Spanish, German)
- **Responsive Design**: Mobile-first approach with touch-friendly interactions
- **Modern UI/UX**: Glassmorphism design with smooth animations
- **Dark/Light Mode**: Adaptive theming for comfortable learning
- **Sidebar Navigation**: Collapsible sidebar with floating toggle button

### 🛠️ Technical Highlights
- **MERN Stack**: MongoDB, Express.js, React, Node.js
- **TypeScript**: Type-safe development throughout
- **JWT Authentication**: Secure user authentication and session management
- **Email Verification**: Complete user registration flow
- **Internationalization**: React i18next with RTL support
- **Modern CSS**: Glassmorphism effects and responsive design

## 📚 Supported Technologies

Master CLI commands for these essential technologies:

- **🐚 Bash** - Shell scripting and automation (45 commands)
- **🐳 Docker** - Containerization and deployment (52 commands)
- **📚 Git** - Version control mastery (38 commands)
- **☸️ Kubernetes** - Container orchestration (67 commands)
- **🐧 Linux** - System administration (73 commands)
- **🍃 MongoDB** - NoSQL database operations (41 commands)
- **📦 NPM** - Package management (33 commands)
- **🐘 PostgreSQL** - Relational database management (49 commands)
- **🐍 Python** - Scripting and development (35 commands)
- **🔴 Redis** - Caching and session management (28 commands)
- **☁️ Cloud** - AWS, GCP, Azure management (56 commands)

**Total: 500+ real-world commands**

## 🏗️ Project Structure

```
IT-Learning/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   └── i18n.ts         # Internationalization config
│   ├── public/
│   │   └── locales/        # Translation files
│   └── package.json
├── backend/                 # Node.js Express backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── data/               # Flashcard data
│   └── server.ts           # Express server
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd IT-Learning
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file with your configuration
   cp .env.example .env
   # Edit .env with your MongoDB URI, JWT secret, etc.
   
   # Start the backend server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Start the development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/it-learning

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Email (for verification)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server
PORT=5000
NODE_ENV=development
```

## 🎯 Usage

### For Learners
1. **Register/Login**: Create an account or sign in
2. **Choose Tech Stack**: Select the technology you want to master
3. **Select Mode**: Choose between Flashcards or Q&A mode
4. **Start Learning**: Practice commands and track your progress
5. **Switch Languages**: Use the language selector in the navbar

### For Developers
1. **Study the Code**: Explore modern MERN stack patterns
2. **Extend Features**: Add new tech stacks or commands
3. **Customize UI**: Modify the glassmorphism design
4. **Add Languages**: Extend internationalization support

## 🌟 Key Enhancements Made

### 1. **Fixed Sidebar Toggle Issue**
- Added floating toggle button for closed sidebar
- Improved mobile responsiveness
- Enhanced touch interactions

### 2. **Tech Stack Selection**
- Interactive dashboard with tech stack cards
- Category switching (QA vs Flashcards)
- Dynamic data fetching based on selection

### 3. **Internationalization**
- React i18next integration
- 5-language support with RTL for Arabic
- Language selector in navbar

### 4. **Enhanced Flashcards**
- Grid and single view modes
- Progress tracking with visual indicators
- Navigation buttons (Previous/Next)
- Completion messages and statistics

### 5. **Modern UI/UX**
- Glassmorphism design system
- Smooth animations and transitions
- Professional landing pages
- Mobile-first responsive design

### 6. **Portfolio Presentation**
- Enhanced About page with developer story
- Professional Features page
- Modern Home page with statistics
- Showcase of technical skills

## 🛠️ Technical Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **React i18next** for internationalization
- **Vite** for fast development
- **Modern CSS** with glassmorphism effects

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Nodemailer** for email verification

### Development Tools
- **TypeScript** for type safety
- **ESLint** for code quality
- **ts-node-dev** for development
- **CORS** for cross-origin requests

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with sidebar navigation
- **Tablet**: Adaptive layout with touch-friendly interactions
- **Mobile**: Mobile-first design with collapsible navigation

## 🌍 Internationalization

Supports 5 languages with proper localization:
- **English** (default)
- **Arabic** (with RTL support)
- **French**
- **Spanish**
- **German**

## 🎨 Design System

### Color Palette
- **Primary**: Linear gradients (#4facfe to #00f2fe)
- **Secondary**: Purple gradients (#667eea to #764ba2)
- **Success**: Green gradients (#43e97b to #38f9d7)
- **Error**: Red gradients (#f093fb to #f5576c)

### Typography
- **Headings**: Bold, modern fonts with gradient effects
- **Body**: Clean, readable typography
- **Code**: Monospace fonts for command display

### Effects
- **Glassmorphism**: Translucent cards with backdrop blur
- **Animations**: Smooth transitions and hover effects
- **Shadows**: Layered shadows for depth

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the dist/ folder to your hosting service
```

### Backend Deployment
```bash
cd backend
npm run build
npm start
# Deploy to your server or cloud platform
```

## 🤝 Contributing

This project showcases modern full-stack development practices. Feel free to:
- Study the code structure
- Suggest improvements
- Report issues
- Add new features

## 📄 License

This project is created as a portfolio piece by a self-taught developer. Feel free to use it as inspiration for your own projects.

## 👨‍💻 About the Developer

Built by **Badr**, a self-taught full-stack developer from Morocco. This project represents:
- **Months of development** and refinement
- **Modern MERN stack** implementation
- **Professional UI/UX** design
- **Real-world problem solving**
- **Portfolio-ready** code quality

This is my first major MERN stack project, designed to showcase my skills and help other developers master the command line. It demonstrates my ability to build production-ready applications from scratch.

---

**Ready to master the command line? Start your journey today!** 🚀

