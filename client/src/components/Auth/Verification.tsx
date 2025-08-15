// src/components/Auth/Verification.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Verification = () => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verify = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }

      try {
        const res = await fetch(`/api/auth/verify/${token}`);
        if (res.ok) {
          setStatus('success');
          setMessage('Your email has been verified! You can now log in.');
        } else {
          const data = await res.json();
          setStatus('error');
          setMessage(data.message || 'Verification failed. Link may be expired.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Network error. Please try again.');
      }
    };

    verify();
  }, [location]);

  return (
    <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
      <h2>Email Verification</h2>
      <p>{message}</p>
      {status === 'success' && (
        <button
          onClick={() => navigate('/login')}
          style={{
            background: '#2ecc71',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            marginTop: '1rem',
            cursor: 'pointer'
          }}
        >
          Go to Login
        </button>
      )}
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
