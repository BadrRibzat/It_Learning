// src/services/flashcardService.ts
import api from './api';

export const getStack = async (stackId: string) => {
  try {
    const res = await api.get(`/flashcards/stacks/${stackId}`);
    return res.data;
  } catch (err) {
    console.error('Failed to load stack:', err);
    throw err;
  }
};

export const validateAnswer = async (stackId: string, cardId: string, input: string) => {
  try {
    const res = await api.post('/flashcards/validate', { stackId, cardId, input });
    return res.data.correct;
  } catch (err) {
    console.error('Answer validation failed:', err);
    return false;
  }
};
