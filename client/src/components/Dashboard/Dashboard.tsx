// src/components/Dashboard/Dashboard.tsx
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { useProgress } from '../../hooks/useProgress';
import Sidebar from '../Sidebar/Sidebar';
import Flashcards from '../Flashcards/Flashcards';
import './Dashboard.css';

const Dashboard = () => {
  const { logout } = useAuth();
  const [activeStack, setActiveStack] = useState('bash'); // Default
  const { ring, loading } = useProgress(activeStack);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar activeStack={activeStack} onSelectStack={setActiveStack} progress={ring} loading={loading} />

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>CLI Mastery</h1>
          <button onClick={logout} className="logout-btn">Logout</button>
        </header>

        {/* Dynamic Flashcards/QA */}
        <Flashcards stackId={activeStack} />
      </main>
    </div>
  );
};

export default Dashboard;
