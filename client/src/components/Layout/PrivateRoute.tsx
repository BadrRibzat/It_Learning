// src/components/Layout/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Canvas } from '@react-three/fiber';
import { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';

const LoadingSpinner = () => {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) meshRef.current.rotation.y += 0.05;
  });
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <torusGeometry args={[0.5, 0.1, 16, 100]} />
      <meshStandardMaterial color="#917FB3" />
    </mesh>
  );
};

const PrivateRoute = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {!user && (
        <Canvas style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', height: '100px', width: '100px' }}>
          <ambientLight />
          <LoadingSpinner />
        </Canvas>
      )}
      <Outlet />
    </div>
  );
};

export default PrivateRoute;
