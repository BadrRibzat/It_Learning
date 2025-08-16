// src/components/Dashboard/Dashboard.tsx
import { useAuth } from '../../context/AuthContext';
import CircularProgressBar from '../Progress/CircularProgressBar';
import Checklist from '../Progress/Checklist';
import { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [progress, setProgress] = useState({
    correct: 3,
    total: 5,
    stackProgress: [
      { name: 'bash', completed: true, progress: 60 },
      { name: 'docker', completed: false, progress: 30 },
      { name: 'git', completed: true, progress: 80 },
      { name: 'kubernetes', completed: false, progress: 10 }
    ]
  });

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {user?.username}</h1>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </header>

      <main className="dashboard-main">
        <section className="progress-section">
          <div className="progress-card">
            <h2>Progress</h2>
            <CircularProgressBar correct={3} total={5} />
            <div className="progress-stats">
              <span>3 Passed</span>
              <span>2 Failed</span>
            </div>
          </div>
        </section>

      <section className="flashcards-section">
        <h2>Flashcards</h2>
        <div className="flashcards-grid">
          {progress.stackProgress.map((item) => (
            <div key={item.name} className="flashcard-item">
              <div className="flashcard-header">{item.name.toUpperCase()}</div>
              <div className="flashcard-body">
                <div className="flashcard-status">
                  <span className={`status-icon ${item.completed ? '✓' : '✗'}`}>
                    {item.completed ? '✓' : '✗'}
                  </span>
                  <span className="status-label">{item.completed ? 'Completed' : 'In Progress'}</span>
                </div>
                <div className="flashcard-progress">
                  <div
                    className="progress-bar"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                  <span className="progress-text">{item.progress}% Complete</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  </div>
  );
};

export default Dashboard;
