// src/components/Dashboard/Dashboard.tsx
import { useAuth } from '../../context/AuthContext';
import { Canvas, useFrame } from '@react-three/fiber'; // Added useFrame
import { useRef, Suspense } from 'react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div>
      <h1>Welcome {user?.username}</h1>
      <button onClick={logout}>Logout</button>
      <Canvas style={{ height: '200px' }}>
        <ambientLight />
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#E5BEEC" />
        </mesh>
      </Canvas>
    </div>
  );
};

export default Dashboard;
