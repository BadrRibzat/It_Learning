// src/components/QA/QAItem.tsx
import React, { useState } from 'react';
import './QAItem.css';
import { useTranslation } from 'react-i18next';

interface QAItemProps {
  question: string;
  explanation: string;
}

const QAItem = ({ question, explanation }: QAItemProps) => {
  const [revealed, setRevealed] = useState(false);
  const { t } = useTranslation();

  return (
    <div className={`qa-item ${revealed ? 'revealed' : ''}`} onClick={() => setRevealed(!revealed)}>
      <div className="qa-question">
        <strong>{t('qa.question_prefix')}</strong> {question}
      </div>
      {revealed && (
        <div className="qa-answer">
          <strong>{t('qa.answer_prefix')}</strong> {explanation}
        </div>
      )}
      <div className="qa-hint">
        {revealed ? t('qa.click_to_hide') : t('qa.click_to_reveal')}
      </div>
    </div>
  );
};

export default QAItem;
