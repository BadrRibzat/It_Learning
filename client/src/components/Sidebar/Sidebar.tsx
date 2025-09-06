// Enhanced Sidebar.tsx with modern styling and animations
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import CircularProgressBar from '../Progress/CircularProgressBar';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Sidebar.css';

const stacks = [
  { id: 'bash', name: 'Bash', icon: '🐚' },
  { id: 'docker', name: 'Docker', icon: '🐳' },
  { id: 'git', name: 'Git', icon: '📚' },
  { id: 'kubernetes', name: 'Kubernetes', icon: '☸️' },
  { id: 'cloud', name: 'Cloud', icon: '☁️' },
  { id: 'linux', name: 'Linux', icon: '🐧' },
  { id: 'mongodb', name: 'MongoDB', icon: '🍃' },
  { id: 'npm', name: 'NPM', icon: '📦' },
  { id: 'postgresql', name: 'PostgreSQL', icon: '🐘' },
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'redis', name: 'Redis', icon: '🔴' }
];

interface SidebarProps {
  activeStack: string;
  onSelectStack: (stackId: string) => void;
  progress: {
    correct: number;
    total: number;
  } | null;
  loading: boolean;
}

const Sidebar = ({ activeStack, onSelectStack, progress, loading }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const { logout, user } = useAuth();

  const handleStackSelect = (stackId: string) => {
    onSelectStack(stackId);
    // Add a subtle animation effect
    const activeButton = document.querySelector('.sidebar-link.active');
    if (activeButton) {
      activeButton.classList.add('pulse');
      setTimeout(() => {
        activeButton.classList.remove('pulse');
      }, 600);
    }
  };

  const progressPercentage = progress ? Math.round((progress.correct / progress.total) * 100) : 0;

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-title">
          <h3>Tech Stacks</h3>
          <span className="sidebar-subtitle">Master CLI Commands</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="toggle-btn"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          <span className={`toggle-icon ${isOpen ? 'open' : 'closed'}`}>
            ◀
          </span>
        </button>
      </div>

          {/* Add floating toggle button when sidebar is closed */}
    {!isOpen && (
      <button
        onClick={() => setIsOpen(true)}
        className="toggle-btn floating"
        aria-label="Open sidebar"
        style={{
          position: 'fixed',
          left: '10px',
          top: '10px',
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
      >
        ◀
      </button>
    )}

      {/* User Info */}
      {user && (
        <div className="sidebar-user">
          <div className="user-avatar">
            {user.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-info">
            <span className="user-name">Welcome back!</span>
            <span className="user-email">{user.email}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h4 className="nav-section-title">Learning Paths</h4>
          {stacks.map((stack, index) => (
            <button
              key={stack.id}
              className={`sidebar-link ${activeStack === stack.id ? 'active' : ''}`}
              onClick={() => handleStackSelect(stack.id)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="stack-icon">{stack.icon}</span>
              <span className="stack-name">{stack.name}</span>
              <span className="stack-indicator"></span>
            </button>
          ))}
        </div>
      </nav>

      {/* Progress Section */}

      {/* Theme Toggle */}
      <div className="sidebar-theme">
        <ThemeToggle />
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <button
          onClick={logout}
          className="logout-btn"
        >
          <span className="logout-icon">🚪</span>
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

