// src/components/Auth/Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      return setError(t('errors.passwords_do_not_match'));
    }

    try {
      const result = await register(username, email, password);
      if (result === 'success') {
        setSuccess(true);
      } else {
        setError(result);
      }
    } catch (err) {
      setError(t('errors.registration_failed'));
      console.error('Registration failed:', err);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h2>{t('verify_email_title')}</h2>
          <p>{t('verify_email_body')}</p>
          <button
            onClick={() => navigate('/login')}
            className="auth-button"
          >
            {t('continue_to_login')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{t('register')}</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('username')}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>{t('email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>{t('password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>{t('confirm_password')}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">
            {t('register')}
          </button>
        </form>
        <p className="auth-link">
          {t('already_have_account')}{' '}
          <a onClick={() => navigate('/login')}>{t('login')}</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
