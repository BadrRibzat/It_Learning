import axiosInstance from './axios';

const flashcardsService = {
  getFlashcards: () => axiosInstance.get('/flashcards/'),
  getFlashcard: (id) => axiosInstance.get(`/flashcards/${id}/`),
  submitFlashcard: (id, answer) => axiosInstance.post(`/flashcard-submit/${id}/`, { answer }),
};

export default flashcardsService;
