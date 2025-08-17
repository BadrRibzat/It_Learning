// src/hooks/useProgress.ts
import { useState, useEffect } from 'react';

export const useProgress = (stackId: string) => {
  const [ring, setRing] = useState(null);
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const headers = { 'Authorization': `Bearer ${token}` };

        const [ringRes, checklistRes] = await Promise.all([
          fetch(`/api/progress/ring/${stackId}`, { headers }),
          fetch(`/api/progress/checklist/${stackId}`, { headers })
        ]);

        if (ringRes.ok) setRing(await ringRes.json());
        if (checklistRes.ok) setChecklist(await checklistRes.json());
      } catch (err) {
        console.error('Failed to fetch progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [stackId]);

  return { ring, checklist, loading };
};
