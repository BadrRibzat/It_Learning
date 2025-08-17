// src/components/Flashcards/Flashcards.tsx
import { useState, useEffect } from 'react';
import Flashcard from '../Flashcard/Flashcard';
import QAItem from '../QA/QAItem';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import './Flashcards.css';

const Flashcards = ({ stackId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'flashcard' | 'qa'>('flashcard');

  useEffect(() => {
    const fetchStack = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/flashcards/stacks', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const payload = await res.json();
        
        // ✅ Validate payload structure
        if (!payload?.stacks) {
          console.error('Invalid payload:', payload);
          return;
        }

        const stack = payload.stacks.find(s => s.id === stackId);
        if (!stack) throw new Error('Stack not found');

        setData(stack);
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

  // ✅ Safely access flashcards and qa_mode with fallbacks
  const flashcards = Array.isArray(data.flashcards) ? data.flashcards : [];
  const qaMode = Array.isArray(data.qa_mode) ? data.qa_mode : [];

  return (
    <div className="flashcards-container">
      <h2>{data.name?.en || 'Untitled Stack'}</h2>
      <p>{data.description?.en || 'No description available'}</p>

      <ErrorBoundary>
        <Flashcards stackId={activeStack} />
      </ErrorBoundary>

      <div className="flashcards-list">
        {flashcards.length > 0 ? (
          flashcards.map(card => (
            <Flashcard
              key={card.cardId}
              cardId={card.cardId}
              stackId={stackId}
              question={card.question_translations?.en || card.question_translations?.default || 'No question'}
              answer={card.command || 'No answer'}
              validAnswers={Array.isArray(card.valid_answers) ? card.valid_answers : [card.command]}
              answerMatch={card.answer_match || { mode: 'exact' }}
            />
          ))
        ) : (
          <p>No flashcards available for this stack.</p>
        )}
      </div>

      {/* QA Mode Section */}
      {qaMode.length > 0 && (
        <div className="qa-section">
          <h3>Conceptual Questions</h3>
          {qaMode.map(qa => (
            <QAItem
              key={qa.qaId}
              question={qa.question_translations?.en || qa.question_translations?.default || 'No question'}
              explanation={qa.explanation_translations?.en || qa.explanation_translations?.default || 'No explanation'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Flashcards;
