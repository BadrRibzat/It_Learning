// src/components/Progress/Checklist.tsx
import React from 'react';
import './Checklist.css';

interface ChecklistProps {
  passed: boolean[];
}

const Checklist = ({ passed }: ChecklistProps) => {
  return (
    <div className="checklist">
      {passed.map((status, index) => (
        <div key={index} className={`check-item ${status ? 'passed' : 'failed'}`}>
          {status ? '✓' : '✗'}
        </div>
      ))}
    </div>
  );
};

export default Checklist;
