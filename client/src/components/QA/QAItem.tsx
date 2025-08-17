// src/components/QA/QAItem.tsx
import React, { useState } from 'react';
import './QAItem.css';

const QAItem = ({ question, explanation }) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className={`qa-item ${revealed ? 'revealed' : ''}`} onClick={() => setRevealed(!revealed)}>
      <div className="qa-question">
        <strong>Q:</strong> {question}
      </div>
      {revealed && (
        <div className="qa-answer">
          <strong>A:</strong> {explanation}
        </div>
      )}
      <div className="qa-hint">
        {revealed ? 'Click to hide' : 'Click to reveal answer'}
      </div>
    </div>
  );
};

export default QAItem;
