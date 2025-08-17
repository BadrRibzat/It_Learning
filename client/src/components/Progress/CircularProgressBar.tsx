// src/components/Progress/CircularProgressBar.tsx
import React from 'react';
import './CircularProgressBar.css';

interface ProgressBarProps {
  correct: number;
  total: number;
}

const CircularProgressBar = ({ correct, total }: ProgressBarProps) => {
  const safeCorrect = correct || 0;
  const safeTotal = total || 1;
  const percentage = (safeCorrect / safeTotal) * 100;
  const progressColor = percentage >= 50 ? '#2ecc71' : '#e74c3c';

  return (
    <div className="circular-progress" style={{ '--progress-color': progressColor }}>
      <span className="progress-text">
        {safeCorrect} vs {safeTotal}
      </span>
    </div>
  );
};

export default CircularProgressBar;
