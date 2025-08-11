# IT-Learning: CLI Mastery Platform

![Project Logo](https://cdn.hailuoai.video/moss/prod/hlf_images/411304020119855113/your-logo.png)  <!-- Add your logo here -->

A comprehensive MERN stack application for learning command-line interfaces through interactive flashcards and quizzes.

## Project Overview

IT-Learning is a web platform designed to help developers master various command-line interfaces across different technologies. The application features categorized flashcards with real-time validation and progress tracking.

## Features

- **User Authentication**: Secure registration and email verification
- **Flashcard System**: 
  - Two learning modes: Flashcard and QA
  - 3D flip animation for interactive learning
  - Real-time answer validation
- **Progress Tracking**: Visual indicators showing completed vs. total flashcards
- **Multilingual Support**: Available in Arabic, French, Spanish, English, and German
- **Responsive Design**: Works on both desktop and mobile devices

## Tech Stack

- **Frontend**: React.js, TypeScript
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Email Service**: Brevo (formerly Sendinblue)
- **State Management**: Redux/Context API
- **UI Framework**: React with modern CSS transitions

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v18+)
- npm or yarn
- MongoDB account (for database)
- Brevo account (for email verification)

## Installation

### Clone the repository

```bash
git clone https://github.com/yourusername/IT-Learning.git
cd IT-Learning

Backend Setup
```bash
cd server
npm install

Create a .env file in the server directory with the following variables:
```bash
# === APP CONFIG ===
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
DEBUG=True

# === AUTH ===
SECRET_KEY=your_jwt_secret_key_here

# === DATABASE ===
MONGO_URI=your_mongodb_connection_string

# === REDIS (for caching + session store) ===
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# === EMAIL (Brevo) ===
EMAIL_SERVICE=brevo
EMAIL_API_KEY=your_brevo_api_key
EMAIL_SENDER=your-verified-email@domain.com

Run the backend server:
```bash
npm run dev

Frontend Setup



