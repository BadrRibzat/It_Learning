// src/hooks/useProgress.ts
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface RingProgress {
  correct: number;
  total: number;
}

export const useProgress = (stackId: string) => {
  const [ring, setRing] = useState<RingProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const headers = { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const res = await fetch(`/api/progress/ring/${stackId}`, { headers });
        
        if (res.ok) {
          const data = await res.json();
          setRing(data);
        } else {
          console.error('Progress fetch failed:', await res.text());
          setRing({ correct: 0, total: 0 });
        }
      } catch (err) {
        console.error('Failed to fetch progress:', err);
        setRing({ correct: 0, total: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [stackId]);

  return { ring, loading };
};
