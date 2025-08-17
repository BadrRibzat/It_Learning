// Enhanced Dashboard.tsx with modern layout and animations
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { useProgress } from '../../hooks/useProgress';
import Sidebar from '../Sidebar/Sidebar';
import Flashcards from '../Flashcards/Flashcards';
import './Dashboard.css';

const Dashboard = () => {
  const { logout, user } = useAuth();
  const [activeStack, setActiveStack] = useState('bash');
  const { ring, loading } = useProgress(activeStack);
  const [stats, setStats] = useState({
    totalCards: 0,
    completedCards: 0,
    accuracy: 0,
    streak: 0
  });

  // Calculate stats based on progress
  useEffect(() => {
    if (ring) {
      const accuracy = ring.total > 0 ? Math.round((ring.correct / ring.total) * 100) : 0;
      setStats({
        totalCards: ring.total,
        completedCards: ring.correct,
        accuracy: accuracy,
        streak: Math.floor(accuracy / 10) // Simple streak calculation
      });
    }
  }, [ring]);

  const handleStackChange = (stackId: string) => {
    setActiveStack(stackId);
    // Add smooth transition effect
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
      {/* Enhanced Sidebar */}
      <Sidebar
        activeStack={activeStack}
        onSelectStack={handleStackChange}
        progress={ring}
        loading={loading}
      />

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Enhanced Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-title">
              <h1>CLI Mastery Dashboard</h1>
              <p className="header-subtitle">
                Master command-line interfaces with interactive learning
              </p>
            </div>
            <div className="header-actions">
              <div className="user-greeting">
                <span>Welcome back, {user?.email?.split('@')[0] || 'User'}!</span>
              </div>
              <button onClick={logout} className="logout-btn">
                <span className="logout-icon">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <h3>Total Cards</h3>
              <p className="value">{stats.totalCards}</p>
              <span className="stat-label">Available to learn</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Completed</h3>
              <p className="value">{stats.completedCards}</p>
              <span className="stat-label">Cards mastered</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3>Accuracy</h3>
              <p className="value">{stats.accuracy}%</p>
              <span className="stat-label">Success rate</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <h3>Streak</h3>
              <p className="value">{stats.streak}</p>
              <span className="stat-label">Day streak</span>
            </div>
          </div>
        </div>

        {/* Current Stack Info */}
        <div className="current-stack-info">
          <div className="stack-header">
            <h2>
              Currently Learning: <span className="stack-name">{activeStack.toUpperCase()}</span>
            </h2>
            <div className="stack-progress">
              <div className="progress-bar">
                <div 
                  className="progress-bar__inner progress-bar__inner--correct"
                  style={{ 
                    width: ring ? `${(ring.correct / ring.total) * 100}%` : '0%' 
                  }}
                ></div>
              </div>
              <span className="progress-text">
                {ring ? `${ring.correct}/${ring.total} completed` : 'Loading...'}
              </span>
            </div>
          </div>
        </div>

        {/* Flashcards Section */}
        <div className="flashcards-section">
          <Flashcards stackId={activeStack} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

