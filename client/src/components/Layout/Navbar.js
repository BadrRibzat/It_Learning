import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// Enhanced Navbar.tsx with theme toggle and modern styling
import { useState } from 'react';
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
    const isActive = (path) => {
        return location.pathname === path;
    };
    const handleLinkClick = () => {
        setIsOpen(false);
    };
    return (_jsx("nav", { className: "navbar", children: _jsxs("div", { className: "navbar-container", children: [_jsxs(Link, { to: "/", className: "logo", onClick: handleLinkClick, children: [_jsx("img", { src: "/logo.png", alt: "CLI Mastery", className: "logo-image" }), _jsx("span", { className: "logo-text", children: t('app_title') })] }), _jsx("button", { className: "menu-toggle", onClick: () => setIsOpen(!isOpen), "aria-label": "Toggle menu", children: _jsxs("span", { className: `hamburger ${isOpen ? 'active' : ''}`, children: [_jsx("span", {}), _jsx("span", {}), _jsx("span", {})] }) }), _jsxs("ul", { className: `nav-links ${isOpen ? 'active' : ''}`, children: [_jsx("li", { children: _jsx(Link, { to: "/", className: isActive('/') ? 'active' : '', onClick: handleLinkClick, children: t('home', 'Home') }) }), _jsx("li", { children: _jsx(Link, { to: "/features", className: isActive('/features') ? 'active' : '', onClick: handleLinkClick, children: t('features', 'Features') }) }), _jsx("li", { children: _jsx(Link, { to: "/about", className: isActive('/about') ? 'active' : '', onClick: handleLinkClick, children: t('about', 'About') }) }), user ? (_jsxs(_Fragment, { children: [_jsx("li", { children: _jsx(Link, { to: "/dashboard", className: isActive('/dashboard') ? 'active' : '', onClick: handleLinkClick, children: t('dashboard') }) }), _jsx("li", { children: _jsx("button", { onClick: () => {
                                            logout();
                                            handleLinkClick();
                                        }, className: "nav-logout-btn", children: t('logout') }) })] })) : (_jsxs(_Fragment, { children: [_jsx("li", { children: _jsx(Link, { to: "/login", className: isActive('/login') ? 'active' : '', onClick: handleLinkClick, children: t('login') }) }), _jsx("li", { children: _jsx(Link, { to: "/register", className: `register-btn ${isActive('/register') ? 'active' : ''}`, onClick: handleLinkClick, children: t('register') }) })] })), _jsx("li", { className: "navbar-controls", children: _jsx(LanguageSelector, {}) }), _jsx("li", { className: "theme-toggle-container", children: _jsx(ThemeToggle, {}) })] })] }) }));
};
export default Navbar;
