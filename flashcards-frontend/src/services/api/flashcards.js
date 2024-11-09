import axiosInstance from './axios';
import { API_ENDPOINTS } from '@/config';

const flashcardsService = {
  getFlashcards: (lessonId) => axiosInstance.get(`${API_ENDPOINTS.FLASHCARDS.LIST}?lesson=${lessonId}`),
  getFlashcard: (id) => axiosInstance.get(API_ENDPOINTS.FLASHCARDS.DETAIL(id)),
  submitFlashcard: (id, answer) => axiosInstance.post(API_ENDPOINTS.FLASHCARDS.SUBMIT(id), { answer }),
};

export default flashcardsService;
