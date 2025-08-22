import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/Dashboard/Dashboard.tsx
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { useProgress } from '../../hooks/useProgress';
import Sidebar from '../Sidebar/Sidebar';
import Flashcards from '../Flashcards/Flashcards';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import './Dashboard.css';
const Dashboard = () => {
    const { user } = useAuth();
    const [activeStack, setActiveStack] = useState('bash');
    const { ring, loading: progressLoading } = useProgress(activeStack);
    const progressPercentage = ring ? Math.round((ring.correct / ring.total) * 100) : 0;
    const [stats, setStats] = useState({
        totalCards: 0,
        completedCards: 0,
        accuracy: 0,
        streak: 0
    });
    // Safely calculate stats only when ring exists
    useEffect(() => {
        if (ring && typeof ring.correct === 'number' && typeof ring.total === 'number' && ring.total > 0) {
            const accuracy = Math.round((ring.correct / ring.total) * 100);
            setStats({
                totalCards: ring.total,
                completedCards: ring.correct,
                accuracy,
                streak: Math.floor(accuracy / 10)
            });
        }
        else {
            setStats({
                totalCards: 0,
                completedCards: 0,
                accuracy: 0,
                streak: 0
            });
        }
    }, [ring]);
    const safeCorrect = ring && typeof ring.correct === 'number' ? ring.correct : 0;
    const safeTotal = ring && typeof ring.total === 'number' && ring.total > 0 ? ring.total : 1;
    const handleStackChange = (stackId) => {
        setActiveStack(stackId);
        // Optional: add animation
        const mainContent = document.querySelector('.dashboard-main');
        if (mainContent) {
            mainContent.classList.add('fade-in');
            setTimeout(() => {
                mainContent.classList.remove('fade-in');
            }, 600);
        }
    };
    return (_jsxs("div", { className: "dashboard-layout", children: [_jsx(Sidebar, { activeStack: activeStack, onSelectStack: handleStackChange, progress: ring, loading: progressLoading }), _jsxs("main", { className: "dashboard-main", children: [_jsxs("div", { className: "stats-bar", children: [_jsxs("div", { className: "stat-item", children: [_jsx("span", { className: "stat-icon", children: "\uD83D\uDCDA" }), _jsx("span", { className: "stat-label", children: "Total" }), _jsx("span", { className: "stat-value", children: stats.totalCards })] }), _jsxs("div", { className: "stat-item", children: [_jsx("span", { className: "stat-icon", children: "\u2705" }), _jsx("span", { className: "stat-label", children: "Done" }), _jsx("span", { className: "stat-value", children: stats.completedCards })] }), _jsxs("div", { className: "stat-item", children: [_jsx("span", { className: "stat-icon", children: "\uD83C\uDFAF" }), _jsx("span", { className: "stat-label", children: "Acc" }), _jsxs("span", { className: "stat-value", children: [stats.accuracy, "%"] })] }), _jsxs("div", { className: "stat-item", children: [_jsx("span", { className: "stat-icon", children: "\uD83D\uDD25" }), _jsx("span", { className: "stat-label", children: "Streak" }), _jsx("span", { className: "stat-value", children: stats.streak })] })] }), _jsx("div", { className: "current-stack-info", children: _jsxs("div", { className: "stack-header", children: [_jsxs("h2", { children: ["Currently Learning: ", _jsx("span", { className: "stack-name", children: activeStack.toUpperCase() })] }), _jsxs("div", { className: "stack-progress", children: [_jsx("div", { className: "progress-bar", children: _jsx("div", { className: "progress-bar__inner progress-bar__inner--correct", style: { width: `${(safeCorrect / safeTotal) * 100}%` } }) }), _jsx("span", { className: "main-progress-text", children: ring ? `${ring.correct}/${ring.total} completed` : 'Loading...' })] })] }) }), _jsx("div", { className: "flashcards-section", children: _jsx(ErrorBoundary, { children: _jsx(Flashcards, { stackId: activeStack }) }) })] })] }));
};
export default Dashboard;
