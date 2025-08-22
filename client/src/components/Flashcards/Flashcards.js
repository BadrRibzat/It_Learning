import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/Flashcards/Flashcards.tsx
import { useState, useEffect } from 'react';
import Flashcard from '../Flashcard/Flashcard';
import QAItem from '../QA/QAItem';
import './Flashcards.css';
const Flashcards = ({ stackId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mode, setMode] = useState('flashcard');
    const [showGrid, setShowGrid] = useState(false);
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`/api/flashcards/stacks/${stackId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const payload = await res.json();
                if (!res.ok)
                    throw new Error(payload.message || 'Failed to load');
                if (!cancelled)
                    setData(payload);
            }
            catch (err) {
                console.error('Failed to load stack:', err);
                if (!cancelled)
                    setData(null);
            }
            finally {
                if (!cancelled)
                    setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [stackId]);
    if (loading)
        return _jsx("div", { className: "loading-spinner", children: "Loading flashcards..." });
    if (!data)
        return _jsx("div", { className: "error-message", children: "Stack not found" });
    const flashcards = Array.isArray(data.flashcards) ? data.flashcards : [];
    const qaMode = Array.isArray(data.qa_mode) ? data.qa_mode : [];
    const currentCard = flashcards[currentIndex];
    return (_jsxs("div", { className: "flashcards-container", children: [_jsxs("div", { className: "flashcards-header", children: [_jsx("h2", { className: "stack-title", children: data.name?.en || 'Untitled Stack' }), _jsx("p", { className: "stack-description", children: data.description?.en || 'No description available' }), _jsxs("div", { className: "flashcards-progress", children: [_jsxs("div", { className: "progress-info", children: [_jsx("span", { className: "current-card", children: currentIndex + 1 }), _jsx("span", { className: "separator", children: "/" }), _jsx("span", { className: "total-cards", children: flashcards.length })] }), _jsx("div", { className: "progress-bar-container", children: _jsx("div", { className: "progress-bar-fill", style: { width: `${((currentIndex + 1) / Math.max(1, flashcards.length)) * 100}%` } }) })] })] }), _jsxs("div", { className: "mode-toggle", role: "tablist", "aria-label": "Study mode", children: [_jsx("button", { onClick: () => setMode('flashcard'), className: `mode-btn ${mode === 'flashcard' ? 'active' : ''}`, role: "tab", "aria-selected": mode === 'flashcard', children: "\uD83C\uDCCF Flashcards" }), _jsx("button", { onClick: () => setMode('qa'), className: `mode-btn ${mode === 'qa' ? 'active' : ''}`, role: "tab", "aria-selected": mode === 'qa', children: "\u2753 Q&A Mode" })] }), mode === 'flashcard' && flashcards.length > 0 && (_jsxs("div", { className: "flashcard-section", children: [_jsx("div", { className: "flashcard-controls", children: _jsx("button", { onClick: () => setShowGrid(!showGrid), className: `view-toggle ${showGrid ? 'grid-view' : 'single-view'}`, children: showGrid ? '📋 Single View' : '🔲 Grid View' }) }), showGrid ? (_jsxs("div", { className: "flashcards-grid", children: [flashcards.slice(0, 15).map((card, index) => (_jsxs("div", { className: "flashcard-grid-item", children: [_jsx("div", { className: "card-number", children: index + 1 }), _jsx(Flashcard, { cardId: card.cardId, stackId: stackId, question: card.question_translations?.en || 'No question', answer: card.command || 'No answer', validAnswers: Array.isArray(card.valid_answers) ? card.valid_answers : [card.command], answerMatch: card.answer_match || { mode: 'exact' } })] }, card.cardId))), flashcards.length > 15 && (_jsxs("div", { className: "more-cards-indicator", children: ["+", flashcards.length - 15, " more cards"] }))] })) : (_jsxs("div", { className: "flashcard-single", children: [_jsxs("div", { className: "card-counter", children: ["Card ", currentIndex + 1, " of ", flashcards.length] }), _jsx(Flashcard, { cardId: currentCard.cardId, stackId: stackId, question: currentCard.question_translations?.en || 'No question', answer: currentCard.command || 'No answer', validAnswers: Array.isArray(currentCard.valid_answers)
                                    ? currentCard.valid_answers
                                    : [currentCard.command], answerMatch: currentCard.answer_match || { mode: 'exact' } }, currentCard.cardId), _jsxs("div", { className: "flashcard-navigation", children: [_jsx("button", { onClick: () => setCurrentIndex(Math.max(0, currentIndex - 1)), disabled: currentIndex === 0, className: "nav-btn prev-btn", children: "\u2190 Previous" }), _jsx("button", { onClick: () => setCurrentIndex(Math.min(flashcards.length - 1, currentIndex + 1)), disabled: currentIndex === flashcards.length - 1, className: "nav-btn next-btn", children: "Next \u2192" })] }), currentIndex === flashcards.length - 1 && (_jsx("div", { className: "completion-message", children: "\uD83C\uDF89 You\u2019ve completed all flashcards!" }))] }))] })), mode === 'qa' && qaMode.length > 0 && (_jsxs("div", { className: "qa-section", children: [_jsx("h3", { className: "qa-title", children: "Conceptual Questions" }), _jsx("div", { className: "qa-grid", children: qaMode.map((qa, index) => (_jsxs("div", { className: "qa-item-wrapper", children: [_jsx("div", { className: "qa-number", children: index + 1 }), _jsx(QAItem, { question: qa.question_translations?.en || 'No question', explanation: qa.explanation_translations?.en || 'No explanation' })] }, qa.qaId))) })] }))] }));
};
export default Flashcards;
