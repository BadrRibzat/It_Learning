// src/components/Progress/Checklist.tsx
import React from 'react';
import './Checklist.css';
import { useTranslation } from 'react-i18next';

interface ChecklistProps {
  passed: boolean[];
}

const Checklist = ({ passed }: ChecklistProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="checklist">
      {passed.map((status, index) => (
        <div key={index} className={`check-item ${status ? 'passed' : 'failed'}`}>
          {status ? t('checklist.passed') : t('checklist.failed')}
        </div>
      ))}
    </div>
  );
};

export default Checklist;
