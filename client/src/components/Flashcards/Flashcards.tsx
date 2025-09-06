// src/components/Flashcards/Flashcards.tsx
import { useState, useEffect } from 'react';
import Flashcard from '../Flashcard/Flashcard';
import QAItem from '../QA/QAItem';
import './Flashcards.css';
import { getStack } from '../../services/flashcardService';

const Flashcards = ({ stackId }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<'flashcard' | 'qa'>('flashcard');
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await getStack(stackId);
        if (!cancelled) setData(res);
      } catch (err) {
        console.error('Failed to load stack:', err);
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [stackId]);

  if (loading) return <div className="loading-spinner">Loading flashcards...</div>;
  if (!data) return <div className="error-message">Stack not found</div>;

  const flashcards = Array.isArray(data.flashcards) ? data.flashcards : [];
  const qaMode = Array.isArray(data.qa_mode) ? data.qa_mode : [];
  const currentCard = flashcards[currentIndex];

  return (
    <div className="flashcards-container">
      <div className="flashcards-header">
        <h2 className="stack-title">{data.name?.en || 'Untitled Stack'}</h2>
        <p className="stack-description">{data.description?.en || 'No description available'}</p>

        <div className="flashcards-progress">
          <div className="progress-info">
            <span className="current-card">{currentIndex + 1}</span>
            <span className="separator">/</span>
            <span className="total-cards">{flashcards.length}</span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${((currentIndex + 1) / Math.max(1, flashcards.length)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="mode-toggle" role="tablist" aria-label="Study mode">
        <button
          onClick={() => setMode('flashcard')}
          className={`mode-btn ${mode === 'flashcard' ? 'active' : ''}`}
          role="tab"
          aria-selected={mode === 'flashcard'}
        >
          🃏 Flashcards
        </button>
        <button
          onClick={() => setMode('qa')}
          className={`mode-btn ${mode === 'qa' ? 'active' : ''}`}
          role="tab"
          aria-selected={mode === 'qa'}
        >
          ❓ Q&A Mode
        </button>
      </div>

      {/* FLASHCARDS MODE */}
      {mode === 'flashcard' && flashcards.length > 0 && (
        <div className="flashcard-section">
          <div className="flashcard-controls">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`view-toggle ${showGrid ? 'grid-view' : 'single-view'}`}
            >
              {showGrid ? '📋 Single View' : '🔲 Grid View'}
            </button>
          </div>

          {showGrid ? (
            <div className="flashcards-grid">
              {flashcards.slice(0, 15).map((card, index) => (
                <div key={card.cardId} className="flashcard-grid-item">
                  <div className="card-number">{index + 1}</div>
                  <Flashcard
                    cardId={card.cardId}
                    stackId={stackId}
                    question={card.question_translations?.en || 'No question'}
                    answer={card.command || 'No answer'}
                    validAnswers={
                      Array.isArray(card.valid_answers) ? card.valid_answers : [card.command]
                    }
                    answerMatch={card.answer_match || { mode: 'exact' }}
                  />
                </div>
              ))}
              {flashcards.length > 15 && (
                <div className="more-cards-indicator">+{flashcards.length - 15} more cards</div>
              )}
            </div>
          ) : (
            <div className="flashcard-single">
              <div className="card-counter">
                Card {currentIndex + 1} of {flashcards.length}
              </div>

              <Flashcard
                key={currentCard.cardId}
                cardId={currentCard.cardId}
                stackId={stackId}
                question={currentCard.question_translations?.en || 'No question'}
                answer={currentCard.command || 'No answer'}
                validAnswers={
                  Array.isArray(currentCard.valid_answers)
                    ? currentCard.valid_answers
                    : [currentCard.command]
                }
                answerMatch={currentCard.answer_match || { mode: 'exact' }}
              />

              <div className="flashcard-navigation">
                <button
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                  className="nav-btn prev-btn"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setCurrentIndex(Math.min(flashcards.length - 1, currentIndex + 1))}
                  disabled={currentIndex === flashcards.length - 1}
                  className="nav-btn next-btn"
                >
                  Next →
                </button>
              </div>

              {currentIndex === flashcards.length - 1 && (
                <div className="completion-message">🎉 You’ve completed all flashcards!</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* QA MODE */}
      {mode === 'qa' && qaMode.length > 0 && (
        <div className="qa-section">
          <h3 className="qa-title">Conceptual Questions</h3>
          <div className="qa-grid">
            {qaMode.map((qa, index) => (
              <div key={qa.qaId} className="qa-item-wrapper">
                <div className="qa-number">{index + 1}</div>
                <QAItem
                  question={qa.question_translations?.en || 'No question'}
                  explanation={qa.explanation_translations?.en || 'No explanation'}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
