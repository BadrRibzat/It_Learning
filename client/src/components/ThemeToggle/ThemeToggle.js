import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Enhanced ThemeToggle.tsx with improved functionality
import { useState, useEffect } from 'react';
import './ThemeToggle.css';
const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(() => {
        // Check localStorage for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        // Check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    useEffect(() => {
        // Apply theme on component mount
        if (isDark) {
            document.body.classList.add('dark-mode');
        }
        else {
            document.body.classList.remove('dark-mode');
        }
    }, []);
    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        // Update body class
        if (newTheme) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        }
        else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
        // Add transition class for smooth animation
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            toggle.classList.add('transitioning');
            setTimeout(() => {
                toggle.classList.remove('transitioning');
            }, 300);
        }
    };
    return (_jsxs("button", { onClick: toggleTheme, className: "theme-toggle", "aria-label": "Toggle theme", children: [_jsx("span", { className: "theme-toggle-icon", children: isDark ? '☀️' : '🌙' }), _jsx("span", { className: "theme-toggle-text", children: isDark ? 'Light' : 'Dark' })] }));
};
// Alternative switch-style toggle component
export const ThemeToggleSwitch = () => {
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
        }
        else {
            document.body.classList.remove('dark-mode');
        }
    }, []);
    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        if (newTheme) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        }
        else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    };
    return (_jsx("div", { className: `theme-toggle-switch ${isDark ? 'dark' : ''}`, onClick: toggleTheme, role: "button", "aria-label": "Toggle theme", tabIndex: 0, onKeyDown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        } }));
};
export default ThemeToggle;
