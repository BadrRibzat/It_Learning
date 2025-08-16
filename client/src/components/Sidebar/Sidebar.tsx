// src/components/Sidebar/Sidebar.tsx
import { useState } from 'react';
import CircularProgressBar from '../Progress/CircularProgressBar';
import './Sidebar.css';

const stacks = [
  { id: 'bash', name: 'Bash' },
  { id: 'docker', name: 'Docker' },
  { id: 'git', name: 'Git' },
  { id: 'kubernetes', name: 'Kubernetes' },
  { id: 'cloud', name: 'Cloud' },
  { id: 'linux', name: 'Linux' },
  { id: 'mongodb', name: 'MongoDB' },
  { id: 'npm', name: 'NPM' },
  { id: 'postgresql', name: 'PostgreSQL' },
  { id: 'python', name: 'Python' },
  { id: 'redis', name: 'Redis' }
];

const Sidebar = ({ activeStack, onSelectStack, progress, loading }) => {
  const [isOpen, setIsOpen] = useState(true); // Sidebar open by default

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h3>Tech Stacks</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="toggle-btn"
        >
          {isOpen ? '◀' : '▶'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {stacks.map((stack) => (
          <button
            key={stack.id}
            className={`sidebar-link ${activeStack === stack.id ? 'active' : ''}`}
            onClick={() => onSelectStack(stack.id)}
          >
            {stack.name}
          </button>
        ))}
      </nav>

      {/* Progress Ring */}
      <div className="sidebar-progress">
        <h4>Your Progress</h4>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <CircularProgressBar
            correct={progress?.correct || 0}
            total={progress?.total || 1}
          />
        )}
        <p>{progress ? `${Math.round((progress.correct / progress.total) * 100)}%` : '0%'}</p>
      </div>
    </aside>
  );
};

export default Sidebar;
