// src/components/Dashboard/Dashboard.tsx
import { useAuth } from '../../context/AuthContext';
import CircularProgressBar from '../Progress/CircularProgressBar';
import Checklist from '../Progress/Checklist';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const passed = [true, false, true, true, false]; // Example data

  return (
    <div className="dashboard">
      <h1>Welcome {user?.username}</h1>
      <button onClick={logout}>Logout</button>
      <div className="progress-section">
        <CircularProgressBar correct={3} total={5} />
        <Checklist passed={passed} />
      </div>
    </div>
  );
};

export default Dashboard;
