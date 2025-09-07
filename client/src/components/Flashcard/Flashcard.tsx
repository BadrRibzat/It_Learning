// src/components/Flashcard/Flashcard.tsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Flashcard.css';
import { validateAnswer } from '../../services/flashcardService';
import { submitAnswer } from '../../services/progressService';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isCorrect = validAnswers.some(ans => ans.toLowerCase() === input.toLowerCase());
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    try {
      await submitAnswer(stackId, cardId, isCorrect);
      setTimeout(() => setFlipped(true), 1000);
    } catch (err) {
      console.error('Failed to submit progress');
      setTimeout(() => setFlipped(true), 1000);
    }
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
              placeholder={t('flashcard.type_command_placeholder')}
              className="flashcard-input"
            />
            <button type="submit" className="flashcard-submit">
              {t('flashcard.check_button')}
            </button>
          </form>
          {feedback && (
            <div className={`feedback ${feedback}`}>
              {feedback === 'correct' ? t('flashcard.correct_feedback') : t('flashcard.incorrect_feedback')}
            </div>
          )}
        </div>
        <div className="flashcard-back">
          <p><strong>{t('flashcard.answer_label')}</strong> <code>{answer}</code></p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFlipped(false);
              setInput('');
              setFeedback(null);
            }}
            className="flashcard-reset"
          >
            {t('flashcard.reset_button')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
