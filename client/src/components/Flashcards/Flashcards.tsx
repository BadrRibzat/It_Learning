// src/components/Flashcards/Flashcards.tsx
import { useState, useEffect } from 'react';
import Flashcard from '../Flashcard/Flashcard';
import QAItem from '../QA/QAItem';
import './Flashcards.css';
import { getStack } from '../../services/flashcardService';
import { useTranslation } from 'react-i18next';

const Flashcards = ({ stackId }: { stackId: string }) => {
  const { t } = useTranslation();
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

  if (loading) return <div className="loading-spinner">{t('flashcards.loading')}</div>;
  if (!data) return <div className="error-message">{t('flashcards.not_found')}</div>;

  const flashcards = Array.isArray(data.flashcards) ? data.flashcards : [];
  const qaMode = Array.isArray(data.qa_mode) ? data.qa_mode : [];
  const currentCard = flashcards[currentIndex];

  return (
    <div className="flashcards-container">
      <div className="flashcards-header">
        <h2 className="stack-title">{data.name?.en || t('flashcards.untitled_stack')}</h2>
        <p className="stack-description">{data.description?.en || t('flashcards.no_description')}</p>

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
      <div className="mode-toggle" role="tablist" aria-label={t('flashcards.mode_toggle_label')}>
        <button
          onClick={() => setMode('flashcard')}
          className={`mode-btn ${mode === 'flashcard' ? 'active' : ''}`}
          role="tab"
          aria-selected={mode === 'flashcard'}
        >
          {t('flashcards.flashcard_mode')}
        </button>
        <button
          onClick={() => setMode('qa')}
          className={`mode-btn ${mode === 'qa' ? 'active' : ''}`}
          role="tab"
          aria-selected={mode === 'qa'}
        >
          {t('flashcards.qa_mode')}
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
              {showGrid ? t('flashcards.single_view') : t('flashcards.grid_view')}
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
                <div className="more-cards-indicator">
                  {t('flashcards.more_cards', { count: flashcards.length - 15 })}
                </div>
              )}
            </div>
          ) : (
            <div className="flashcard-single">
              <div className="card-counter">
                {t('flashcards.card_counter', { current: currentIndex + 1, total: flashcards.length })}
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
                  {t('flashcards.previous_button')}
                </button>
                <button
                  onClick={() => setCurrentIndex(Math.min(flashcards.length - 1, currentIndex + 1))}
                  disabled={currentIndex === flashcards.length - 1}
                  className="nav-btn next-btn"
                >
                  {t('flashcards.next_button')}
                </button>
              </div>

              {currentIndex === flashcards.length - 1 && (
                <div className="completion-message">
                  {t('flashcards.completion_message')}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* QA MODE */}
      {mode === 'qa' && qaMode.length > 0 && (
        <div className="qa-section">
          <h3 className="qa-title">{t('flashcards.qa_title')}</h3>
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
