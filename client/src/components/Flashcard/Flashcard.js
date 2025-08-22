import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/Flashcard/Flashcard.tsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Flashcard.css';
const Flashcard = ({ cardId, stackId, question, answer, validAnswers, answerMatch }) => {
    const [flipped, setFlipped] = useState(false);
    const [input, setInput] = useState('');
    const [feedback, setFeedback] = useState(null);
    const { user } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isCorrect = validAnswers.some(ans => ans.toLowerCase() === input.toLowerCase());
        setFeedback(isCorrect ? 'correct' : 'incorrect');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/progress/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: user?._id,
                    stackId,
                    cardId,
                    isCorrect
                })
            });
            if (response.ok) {
                setTimeout(() => setFlipped(true), 1000);
            }
        }
        catch (err) {
            console.error('Failed to submit progress');
            // Still flip after delay even if submit fails
            setTimeout(() => setFlipped(true), 1000);
        }
    };
    return (_jsx("div", { className: `flashcard ${flipped ? 'flipped' : ''}`, onClick: () => setFlipped(!flipped), children: _jsxs("div", { className: "flashcard-inner", children: [_jsxs("div", { className: "flashcard-front", children: [_jsx("h3", { children: question }), _jsxs("form", { onSubmit: handleSubmit, onClick: (e) => e.stopPropagation(), className: "flashcard-form", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), placeholder: "Type the command...", className: "flashcard-input" }), _jsx("button", { type: "submit", className: "flashcard-submit", children: "Check" })] }), feedback && (_jsx("div", { className: `feedback ${feedback}`, children: feedback === 'correct' ? '✅ Correct!' : '❌ Try again' }))] }), _jsxs("div", { className: "flashcard-back", children: [_jsxs("p", { children: [_jsx("strong", { children: "Answer:" }), " ", _jsx("code", { children: answer })] }), _jsx("button", { onClick: (e) => {
                                e.stopPropagation();
                                setFlipped(false);
                                setInput('');
                                setFeedback(null);
                            }, className: "flashcard-reset", children: "Reset" })] })] }) }));
};
export default Flashcard;
