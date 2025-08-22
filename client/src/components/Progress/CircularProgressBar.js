import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import './CircularProgressBar.css';
const CircularProgressBar = ({ correct, total }) => {
    const safeCorrect = typeof correct === 'number' ? correct : 0;
    const safeTotal = typeof total === 'number' && total > 0 ? total : 1;
    const percentage = (safeCorrect / safeTotal) * 100;
    const progressColor = percentage >= 50 ? '#2ecc71' : '#e74c3c';
    return (_jsx("div", { className: "circular-progress-bar", style: { '--progress-color': '#4facfe' }, children: _jsxs("span", { className: "progress-text", children: [safeCorrect, " vs ", safeTotal] }) }));
};
export default CircularProgressBar;
