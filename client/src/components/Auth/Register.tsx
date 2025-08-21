// src/components/Auth/Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // ✅ Added 'async' here
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      const result = await register(username, email, password);
      if (result === 'success') {
        setSuccess(true);
      } else {
        setError(result);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Registration failed:', err);
    }
  };

  if (success) {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Check Your Email</h2>
        <p>We've sent a verification link to <strong>{email}</strong>.</p>
        <p>Please click the link to verify your account.</p>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: '#6750a4',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="auth-container" style={{ padding: '4rem 1rem' }}>
      <div className="auth-form" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <h2>Create Account</h2>
        {error && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label>UserName</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px'
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px'
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px'
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              background: '#6750a4',
              color: 'white',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '8px'
            }}
          >
            Register
          </button>
        </form>
        <p style={{ marginTop: '1.5rem' }}>
          Already have an account?{' '}
          <a
            onClick={() => navigate('/login')}
            style={{ color: '#6750a4', cursor: 'pointer' }}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
