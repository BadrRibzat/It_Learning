// Enhanced Navbar.tsx with theme toggle and modern styling
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo" onClick={handleLinkClick}>
          <img src="/logo.png" alt="CLI Mastery" className="logo-image" />
          <span className="logo-text">CLI Mastery</span>
        </Link>
        
        <button 
          className="menu-toggle" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        
        <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
          <li>
            <Link 
              to="/" 
              className={isActive('/') ? 'active' : ''}
              onClick={handleLinkClick}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/features" 
              className={isActive('/features') ? 'active' : ''}
              onClick={handleLinkClick}
            >
              Features
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={isActive('/about') ? 'active' : ''}
              onClick={handleLinkClick}
            >
              About
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
                  Dashboard
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => {
                    logout();
                    handleLinkClick();
                  }}
                  className="nav-logout-btn"
                >
                  Logout
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
                  Login
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className={`register-btn ${isActive('/register') ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  Register
                </Link>
              </li>
            </>
          )}
          
          <li className="theme-toggle-container">
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;


