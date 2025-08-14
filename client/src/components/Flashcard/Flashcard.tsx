// src/components/Flashcard/Flashcard.tsx
import React, { useState } from 'react';
import './Flashcard.css';

interface FlashcardProps {
  question: string;
  answer: string;
}

const Flashcard = ({ question, answer }: FlashcardProps) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flashcard" onClick={() => setFlipped(!flipped)}>
      <div className={`flashcard-front ${flipped ? 'hidden' : ''}`}>
        <h3>{question}</h3>
      </div>
      <div className={`flashcard-back ${flipped ? '' : 'hidden'}`}>
        <p>{answer}</p>
      </div>
    </div>
  );
};

export default Flashcard;
