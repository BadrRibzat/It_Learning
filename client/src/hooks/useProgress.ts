// src/hooks/useProgress.ts
import { useState, useEffect } from 'react';

interface ProgressRing {
  correct: number;
  total: number;
}

interface ProgressChecklist {
  passed: boolean[];
}

export const useProgress = (stackId: string) => {
  const [ring, setRing] = useState<ProgressRing | null>(null);
  const [checklist, setChecklist] = useState<ProgressChecklist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');

        const res = await fetch(`/api/progress/ring/${stackId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch ring');
        const ringData = await res.json();
        setRing(ringData);

        const checklistRes = await fetch(`/api/progress/checklist/${stackId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!checklistRes.ok) throw new Error('Failed to fetch checklist');
        const checklistData = await checklistRes.json();
        setChecklist(checklistData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [stackId]);

  return { ring, checklist, loading, error };
};
