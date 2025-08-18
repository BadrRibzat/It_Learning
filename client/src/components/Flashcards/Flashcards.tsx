// src/components/Flashcards/Flashcards.tsx
import { useState, useEffect } from 'react';
import Flashcard from '../Flashcard/Flashcard';
import QAItem from '../QA/QAItem';
import './Flashcards.css';

const Flashcards = ({ stackId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<'flashcard' | 'qa'>('flashcard');

  useEffect(() => {
    const fetchStack = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/flashcards/stacks/${stackId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.message || 'Failed to load');
        setData(payload);
      } catch (err) {
        console.error('Failed to load stack:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStack();
  }, [stackId]);

  if (loading) return <p>Loading flashcards...</p>;
  if (!data) return <p>Stack not found</p>;

  const flashcards = Array.isArray(data.flashcards) ? data.flashcards : [];
  const qaMode = Array.isArray(data.qa_mode) ? data.qa_mode : [];

  const currentCard = flashcards[currentIndex];

  return (
    <div className="flashcards-container">
      <h2>{data.name?.en || 'Untitled Stack'}</h2>
      <p>{data.description?.en || 'No description available'}</p>

      {/* Mode Toggle */}
      <div className="mode-toggle">
        <button
          onClick={() => setMode('flashcard')}
          className={mode === 'flashcard' ? 'active' : ''}
        >
          Flashcards
        </button>
        <button
          onClick={() => setMode('qa')}
          className={mode === 'qa' ? 'active' : ''}
        >
          QA Mode
        </button>
      </div>

      {/* Flashcards Mode */}
      {mode === 'flashcard' && flashcards.length > 0 && (
        <div className="flashcard-single">
          <Flashcard
            key={currentCard.cardId}
            cardId={currentCard.cardId}
            stackId={stackId}
            question={currentCard.question_translations?.en || 'No question'}
            answer={currentCard.command || 'No answer'}
            validAnswers={Array.isArray(currentCard.valid_answers) ? currentCard.valid_answers : [currentCard.command]}
            answerMatch={currentCard.answer_match || { mode: 'exact' }}
          />
          <div className="flashcard-nav">
            {currentIndex < flashcards.length - 1 ? (
              <button onClick={() => setCurrentIndex(currentIndex + 1)} className="next-btn">
                Next Flashcard →
              </button>
            ) : (
              <button disabled className="next-btn">
                🎉 All Done!
              </button>
            )}
          </div>
        </div>
      )}

      {/* QA Mode */}
      {mode === 'qa' && qaMode.length > 0 && (
        <div className="qa-section">
          <h3>Conceptual Questions</h3>
          {qaMode.map(qa => (
            <QAItem
              key={qa.qaId}
              question={qa.question_translations?.en || 'No question'}
              explanation={qa.explanation_translations?.en || 'No explanation'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Flashcards;
