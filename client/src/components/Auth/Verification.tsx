// src/components/Auth/Verification.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../utils/api';
import { useTranslation } from 'react-i18next';

const Verification = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const verify = async () => {
      const pathParts = location.pathname.split('/');
      const token = pathParts[2];

      if (!token) {
        setStatus('error');
        setMessage(t('errors.invalid_verification_link'));
        return;
      }

      try {
        const res = await api.get(`/auth/verify/${token}`);
        const data = res.data;

        localStorage.setItem('token', data.token);
        setStatus('success');
        setMessage(t('messages.email_verified'));
        setTimeout(() => navigate('/dashboard'), 1500);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.message || t('errors.verification_failed'));
      }
    };

    verify();
  }, [location, navigate, t]);

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{t('verify_email_title')}</h2>
        <p>{message}</p>
        {status === 'error' && (
          <button
            onClick={() => navigate('/register')}
            className="auth-button"
          >
            {t('try_again')}
          </button>
        )}
      </div>
    </div>
  );
};

export default Verification;
