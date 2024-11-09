import axiosInstance from './axios';
import { API_ENDPOINTS } from '@/config';

const progressService = {
  getUserProgress: () => axiosInstance.get(API_ENDPOINTS.PROGRESS.USER),
  getUserFlashcardProgress: () => axiosInstance.get(API_ENDPOINTS.PROGRESS.FLASHCARD),
  getUserLevelProgress: () => axiosInstance.get(API_ENDPOINTS.PROGRESS.LEVEL),
  getUserQuizAttempts: () => axiosInstance.get(API_ENDPOINTS.PROGRESS.QUIZ_ATTEMPTS),
};

export default progressService;
