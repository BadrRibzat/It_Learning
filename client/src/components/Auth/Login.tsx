// src/components/Auth/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      const result = await login(email, password);
      if (result === 'success') {
        navigate('/dashboard');
      } else {
        setError(result);
      }
    };

  return (
    <div className="auth-container" style={{ padding: '4rem 1rem' }}>
      <div className="auth-form" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <h2>Login</h2>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#6750a4', color: 'white', border: 'none', borderRadius: '8px' }}>
            Login
          </button>
        </form>
        <p style={{ marginTop: '1.5rem' }}>
          Don't have an account? <a onClick={() => navigate('/register')} style={{ color: '#6750a4', cursor: 'pointer' }}>Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
