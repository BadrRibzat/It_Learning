// src/components/Auth/Verification.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Verification = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verify = async () => {
      // Extract token from /verify/TOKEN (not ?token=TOKEN)
      const pathParts = location.pathname.split('/');
      const token = pathParts[2]; // /verify/:token

      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }

      try {
        const res = await fetch(`/api/auth/verify/${token}`);
        const data = await res.json();

        if (!res.ok) {
          setStatus('error');
          setMessage(data.message || 'Verification failed. Link may be expired.');
          return;
        }

        // ✅ Save token and go to login
        localStorage.setItem('token', data.token);
        setStatus('success');
        setMessage('Your email has been verified! Redirecting to dashboard...');
        setTimeout(() => navigate('/dashboard'), 1500);
      } catch (err) {
        setStatus('error');
        setMessage('Network error. Please try again.');
      }
    };

    verify();
  }, [location, navigate]);

  return (
    <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
      <h2>Email Verification</h2>
      <p>{message}</p>
      {status === 'error' && (
        <button
          onClick={() => navigate('/register')}
          style={{
            background: '#6750a4',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            marginTop: '1rem',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default Verification;
