import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/QA/QAItem.tsx
import { useState } from 'react';
import './QAItem.css';
const QAItem = ({ question, explanation }) => {
    const [revealed, setRevealed] = useState(false);
    return (_jsxs("div", { className: `qa-item ${revealed ? 'revealed' : ''}`, onClick: () => setRevealed(!revealed), children: [_jsxs("div", { className: "qa-question", children: [_jsx("strong", { children: "Q:" }), " ", question] }), revealed && (_jsxs("div", { className: "qa-answer", children: [_jsx("strong", { children: "A:" }), " ", explanation] })), _jsx("div", { className: "qa-hint", children: revealed ? 'Click to hide' : 'Click to reveal answer' })] }));
};
export default QAItem;
