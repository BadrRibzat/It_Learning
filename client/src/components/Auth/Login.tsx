// src/components/Auth/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber'; // Removed unused useFrame
import { useRef, Suspense } from 'react';

const FormFrame = () => {
  const meshRef = useRef();
  return (
    <mesh ref={meshRef} position={[0, 0, -1]}> {/* Move back to avoid overlap */}
      <boxGeometry args={[4, 3, 0.1]} />
      <meshStandardMaterial color="#2A2F4F" transparent opacity={0.3} /> {/* Lower opacity */}
    </mesh>
  );
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="auth-container" style={{ position: 'relative', zIndex: 1 }}>
      <Canvas style={{ position: 'absolute', height: '100%', width: '100%', zIndex: -1 }}>
        <ambientLight />
        <FormFrame />
      </Canvas>
      <div className="auth-form" style={{ position: 'relative', zIndex: 1 }}>
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">
            Login
          </button>
        </form>
        <p className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
