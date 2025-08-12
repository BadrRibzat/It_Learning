// src/components/Auth/Register.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber'; // Removed unused useFrame
import { useRef, Suspense } from 'react';

const FormFrame = () => {
  const meshRef = useRef();
  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <boxGeometry args={[4, 3, 0.1]} />
      <meshStandardMaterial color="#2A2F4F" transparent opacity={0.3} />
    </mesh>
  );
};

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth(); // Assuming signup is defined in AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="auth-container" style={{ position: 'relative', zIndex: 1 }}>
      <Canvas style={{ position: 'absolute', height: '100%', width: '100%', zIndex: -1 }}>
        <ambientLight />
        <FormFrame />
      </Canvas>
      <div className="auth-form" style={{ position: 'relative', zIndex: 1 }}>
        <h2>Register</h2>
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
            Register
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
