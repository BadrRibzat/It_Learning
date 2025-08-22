import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Enhanced Sidebar.tsx with modern styling and animations
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Sidebar.css';
const stacks = [
    { id: 'bash', name: 'Bash', icon: '🐚' },
    { id: 'docker', name: 'Docker', icon: '🐳' },
    { id: 'git', name: 'Git', icon: '📚' },
    { id: 'kubernetes', name: 'Kubernetes', icon: '☸️' },
    { id: 'cloud', name: 'Cloud', icon: '☁️' },
    { id: 'linux', name: 'Linux', icon: '🐧' },
    { id: 'mongodb', name: 'MongoDB', icon: '🍃' },
    { id: 'npm', name: 'NPM', icon: '📦' },
    { id: 'postgresql', name: 'PostgreSQL', icon: '🐘' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'redis', name: 'Redis', icon: '🔴' }
];
const Sidebar = ({ activeStack, onSelectStack, progress, loading }) => {
    const [isOpen, setIsOpen] = useState(true);
    const { logout, user } = useAuth();
    const handleStackSelect = (stackId) => {
        onSelectStack(stackId);
        // Add a subtle animation effect
        const activeButton = document.querySelector('.sidebar-link.active');
        if (activeButton) {
            activeButton.classList.add('pulse');
            setTimeout(() => {
                activeButton.classList.remove('pulse');
            }, 600);
        }
    };
    const progressPercentage = progress ? Math.round((progress.correct / progress.total) * 100) : 0;
    return (_jsxs("aside", { className: `sidebar ${isOpen ? 'open' : 'closed'}`, children: [_jsxs("div", { className: "sidebar-header", children: [_jsxs("div", { className: "sidebar-title", children: [_jsx("h3", { children: "Tech Stacks" }), _jsx("span", { className: "sidebar-subtitle", children: "Master CLI Commands" })] }), _jsx("button", { onClick: () => setIsOpen(!isOpen), className: "toggle-btn", "aria-label": isOpen ? "Close sidebar" : "Open sidebar", children: _jsx("span", { className: `toggle-icon ${isOpen ? 'open' : 'closed'}`, children: "\u25C0" }) })] }), user && (_jsxs("div", { className: "sidebar-user", children: [_jsx("div", { className: "user-avatar", children: user.email?.charAt(0).toUpperCase() || 'U' }), _jsxs("div", { className: "user-info", children: [_jsx("span", { className: "user-name", children: "Welcome back!" }), _jsx("span", { className: "user-email", children: user.email })] })] })), _jsx("nav", { className: "sidebar-nav", children: _jsxs("div", { className: "nav-section", children: [_jsx("h4", { className: "nav-section-title", children: "Learning Paths" }), stacks.map((stack, index) => (_jsxs("button", { className: `sidebar-link ${activeStack === stack.id ? 'active' : ''}`, onClick: () => handleStackSelect(stack.id), style: { animationDelay: `${index * 0.05}s` }, children: [_jsx("span", { className: "stack-icon", children: stack.icon }), _jsx("span", { className: "stack-name", children: stack.name }), _jsx("span", { className: "stack-indicator" })] }, stack.id)))] }) }), _jsx("div", { className: "sidebar-theme", children: _jsx(ThemeToggle, {}) }), _jsx("div", { className: "sidebar-footer", children: _jsxs("button", { onClick: logout, className: "logout-btn", children: [_jsx("span", { className: "logout-icon", children: "\uD83D\uDEAA" }), _jsx("span", { className: "logout-text", children: "Logout" })] }) })] }));
};
export default Sidebar;
