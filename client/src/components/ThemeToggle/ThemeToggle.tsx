// src/components/ThemeToggle/ThemeToggle.tsx
import React, { useState, useEffect } from 'react';
import './ThemeToggle.css';
import { useTranslation } from 'react-i18next';

const ThemeToggle = () => {
  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }

    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.classList.add('transitioning');
      setTimeout(() => {
        toggle.classList.remove('transitioning');
      }, 300);
    }
  };

  return (
    <button onClick={toggleTheme} className="theme-toggle" aria-label={t('theme.toggle')}>
      <span className="theme-toggle-icon">
        {isDark ? '☀️' : '🌙'}
      </span>
      <span className="theme-toggle-text">
        {isDark ? t('theme.light') : t('theme.dark')}
      </span>
    </button>
  );
};

// Alternative switch-style toggle component
export const ThemeToggleSwitch = () => {
  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div 
      className={`theme-toggle-switch ${isDark ? 'dark' : ''}`}
      onClick={toggleTheme}
      role="button"
      aria-label={t('theme.toggle')}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTheme();
        }
      }}
    />
  );
};

export default ThemeToggle;
