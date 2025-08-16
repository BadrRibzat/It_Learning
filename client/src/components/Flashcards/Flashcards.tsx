// src/components/Flashcards/Flashcards.tsx
import { useState, useEffect } from 'react';
import Flashcard from '../Flashcard/Flashcard';
//import QAItem from '../QA/QAItem';
import './Flashcards.css';

const Flashcards = ({ stackId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStack = async () => {
      setLoading(true);
      const res = await fetch(`/api/flashcards/stacks`);
      const payload = await res.json();
      const stack = payload.stacks.find(s => s.id === stackId);
      setData(stack);
      setLoading(false);
    };

    fetchStack();
  }, [stackId]);

  if (loading) return <p>Loading flashcards...</p>;
  if (!data) return <p>Stack not found</p>;

  return (
    <div className="flashcards-container">
      <h2>{data.name.en}</h2>
      <p>{data.description.en}</p>

      <div className="flashcards-list">
        {data.flashcards.map(card => (
          <Flashcard
            key={card.cardId}
            cardId={card.cardId}
            stackId={stackId}
            question={card.question_translations.en}
            answer={card.command}
            validAnswers={card.valid_answers}
            answerMatch={card.answer_match}
          />
        ))}
      </div>

      {data.qa_mode.length > 0 && (
        <div className="qa-section">
          <h3>Conceptual Questions</h3>
          {data.qa_mode.map(qa => (
            <QAItem key={qa.qaId} question={qa.question_translations.en} explanation={qa.explanation_translations.en} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Flashcards;
