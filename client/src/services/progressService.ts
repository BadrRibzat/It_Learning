// src/services/progressService.ts
import api from './api';

export const getProgress = async (stackId: string) => {
  try {
    const res = await api.get(`/progress/ring/${stackId}`);
    return res.data;
  } catch (err) {
    console.error('Failed to fetch progress:', err);
    return { correct: 0, total: 0 };
  }
};

export const submitAnswer = async (stackId: string, cardId: string, correct: boolean) => {
  try {
    await api.post('/progress/submit', { stackId, cardId, correct });
  } catch (err) {
    console.error('Failed to submit answer:', err);
  }
};
