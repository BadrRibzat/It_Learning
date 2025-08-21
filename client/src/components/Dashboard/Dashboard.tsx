// src/components/Dashboard/Dashboard.tsx
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { useProgress } from '../../hooks/useProgress';
import Sidebar from '../Sidebar/Sidebar';
import Flashcards from '../Flashcards/Flashcards';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeStack, setActiveStack] = useState('bash');
  const { ring, loading: progressLoading } = useProgress(activeStack);
  const progressPercentage = ring ? Math.round((ring.correct / ring.total) * 100) : 0;

  const [stats, setStats] = useState({
    totalCards: 0,
    completedCards: 0,
    accuracy: 0,
    streak: 0
  });

  // Safely calculate stats only when ring exists
  useEffect(() => {
    if (ring && typeof ring.correct === 'number' && typeof ring.total === 'number' && ring.total > 0) {
      const accuracy = Math.round((ring.correct / ring.total) * 100);
      setStats({
        totalCards: ring.total,
        completedCards: ring.correct,
        accuracy,
        streak: Math.floor(accuracy / 10)
      });
    } else {
      setStats({
        totalCards: 0,
        completedCards: 0,
        accuracy: 0,
        streak: 0
      });
    }
  }, [ring]);

  const safeCorrect = ring && typeof ring.correct === 'number' ? ring.correct : 0;
  const safeTotal = ring && typeof ring.total === 'number' && ring.total > 0 ? ring.total : 1;

  const handleStackChange = (stackId: string) => {
    setActiveStack(stackId);
    // Optional: add animation
    const mainContent = document.querySelector('.dashboard-main');
    if (mainContent) {
      mainContent.classList.add('fade-in');
      setTimeout(() => {
        mainContent.classList.remove('fade-in');
      }, 600);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar with logout in footer */}
      <Sidebar
        activeStack={activeStack}
        onSelectStack={handleStackChange}
        progress={ring}
        loading={progressLoading}
      />

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Compact Stats Bar */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-icon">📚</span>
            <span className="stat-label">Total</span>
            <span className="stat-value">{stats.totalCards}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">✅</span>
            <span className="stat-label">Done</span>
            <span className="stat-value">{stats.completedCards}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🎯</span>
            <span className="stat-label">Acc</span>
            <span className="stat-value">{stats.accuracy}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🔥</span>
            <span className="stat-label">Streak</span>
            <span className="stat-value">{stats.streak}</span>
          </div>
        </div>

        {/* Current Stack Progress */}
        <div className="current-stack-info">
          <div className="stack-header">
            <h2>Currently Learning: <span className="stack-name">{activeStack.toUpperCase()}</span></h2>
            <div className="stack-progress">
              <div className="progress-bar">
                <div
                  className="progress-bar__inner progress-bar__inner--correct"
                  style={{ width: `${(safeCorrect / safeTotal) * 100}%` }}
                ></div>
              </div>
              <span className="main-progress-text">
                {ring ? `${ring.correct}/${ring.total} completed` : 'Loading...'}
              </span>
            </div>
          </div>
        </div>

        {/* Flashcards Section */}
        <div className="flashcards-section">
          <ErrorBoundary>
            <Flashcards stackId={activeStack} />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
