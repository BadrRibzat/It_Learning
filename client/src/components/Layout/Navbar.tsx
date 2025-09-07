// src/components/Layout/Navbar.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const isActive = (path: string) => location.pathname === path;
  const handleLinkClick = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={handleLinkClick}>
          <img src="/logo.png" alt={t('app_title')} className="logo-image" />
          <span className="logo-text">{t('IT-Learning Groups')}</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? t('close_menu') : t('open_menu')}
          aria-expanded={isOpen}
        >
          <div className={`hamburger ${isOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* Navigation Links */}
        <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
          <li>
            <Link
              to="/"
              className={isActive('/') ? 'active' : ''}
              onClick={handleLinkClick}
            >
              {t('home')}
            </Link>
          </li>
          <li>
            <Link
              to="/features"
              className={isActive('/features') ? 'active' : ''}
              onClick={handleLinkClick}
            >
              {t('features')}
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={isActive('/about') ? 'active' : ''}
              onClick={handleLinkClick}
            >
              {t('about')}
            </Link>
          </li>

          {user ? (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className={isActive('/dashboard') ? 'active' : ''}
                  onClick={handleLinkClick}
                >
                  {t('dashboard')}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    handleLinkClick();
                  }}
                  className="nav-logout-btn"
                >
                  {t('logout')}
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className={isActive('/login') ? 'active' : ''}
                  onClick={handleLinkClick}
                >
                  {t('login')}
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className={`register-btn ${
                    isActive('/register') ? 'active' : ''
                  }`}
                  onClick={handleLinkClick}
                >
                  {t('register')}
                </Link>
              </li>
            </>
          )}

          {/* Controls */}
          <li className="navbar-controls">
            <LanguageSelector />
          </li>
          <li className="theme-toggle-container">
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

