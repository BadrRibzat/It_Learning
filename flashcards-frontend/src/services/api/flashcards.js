import axiosInstance from './axios';

const flashcardsService = {
  getFlashcards: (lessonId) => axiosInstance.get(`/flashcards/?lesson=${lessonId}`),
  getFlashcard: (id) => axiosInstance.get(`/flashcards/${id}/`),
  submitFlashcard: (id, answer) => axiosInstance.post(`/flashcard-submit/${id}/`, { answer }),
};

export default flashcardsService;
