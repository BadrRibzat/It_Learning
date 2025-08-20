// src/components/Flashcard/Flashcard.tsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Flashcard.css';

interface FlashcardProps {
  cardId: string;
  stackId: string;
  question: string;
  answer: string;
  validAnswers: string[];
  answerMatch: any;
}

const Flashcard = ({ cardId, stackId, question, answer, validAnswers, answerMatch }: FlashcardProps) => {
  const [flipped, setFlipped] = useState(false);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isCorrect = validAnswers.some(ans => ans.toLowerCase() === input.toLowerCase());
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    // Submit to backend
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/progress/submit', {
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
    } catch (err) {
      console.error('Failed to submit progress');
    }

    setTimeout(() => setFlipped(true), 1000);
  };

  return (
      <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <h3>{question}</h3>
            <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="flashcard-form">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type the command..."
                className="flashcard-input"
              />
              <button type="submit" className="flashcard-submit">Check</button>
            </form>
            {feedback && (
              <div className={`feedback ${feedback}`}>
                {feedback === 'correct' ? '✅ Correct!' : '❌ Try again'}
              </div>
            )}
          </div>
          <div className="flashcard-back">
            <p><strong>Answer:</strong> <code>{answer}</code></p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFlipped(false);
                setInput('');
                setFeedback(null);
              }}
              className="flashcard-reset"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    );
};

export default Flashcard;
