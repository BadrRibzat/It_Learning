// src/components/Progress/CircularProgressBar.tsx
import React from 'react';
import './CircularProgressBar.css';

interface ProgressBarProps {
  correct: number;
  total: number;
}

const CircularProgressBar = ({ correct, total }: ProgressBarProps) => {
  const percentage = (correct / total) * 100;
  const progressColor = percentage >= 50 ? '#2ecc71' : '#e74c3c';

  return (
    <div className="circular-progress" style={{ '--progress-color': progressColor }}>
      <span className="progress-text">
        {correct} vs {total}
      </span>
    </div>
  );
};

export default CircularProgressBar;
