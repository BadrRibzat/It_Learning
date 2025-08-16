// src/components/Dashboard/Dashboard.tsx
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { useProgress } from '../../hooks/useProgress';
import CircularProgressBar from '../Progress/CircularProgressBar';
import Checklist from '../Progress/Checklist';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeStack] = useState('bash'); // Later: make this dynamic
  const { ring, checklist, loading } = useProgress(activeStack);

  if (loading) return <p>Loading progress...</p>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {user?.username}</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </header>

      <main className="dashboard-main">
        <section className="progress-section">
          <div className="progress-card">
            <h2>Progress: {activeStack.toUpperCase()}</h2>
            {ring && <CircularProgressBar correct={ring.correct} total={ring.total} />}
            <div className="progress-stats">
              <span>{ring?.correct} Passed</span>
              <span>{ring?.total - (ring?.correct || 0)} Failed</span>
            </div>
          </div>
        </section>

        <section className="flashcards-section">
          <h2>Flashcards</h2>
          <div className="flashcards-grid">
            {checklist?.passed.map((status, index) => (
              <div key={index} className="flashcard-item">
                <div className="flashcard-header">Card #{index + 1}</div>
                <div className="flashcard-body">
                  <div className="flashcard-status">
                    <span className="status-icon">{status ? '✓' : '✗'}</span>
                    <span className="status-label">{status ? 'Completed' : 'Pending'}</span>
                  </div>
                  <div className="flashcard-progress">
                    <div
                      className="progress-bar"
                      style={{ background: status ? '#4caf50' : '#333' }}
                    ></div>
                    <span className="progress-text">{status ? '100%' : '0%'} Complete</span>
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
