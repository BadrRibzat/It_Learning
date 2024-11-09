import axiosInstance from './axios';
import { API_ENDPOINTS } from '@/config';

const quizzesService = {
  getQuizzes: (lessonId) => axiosInstance.get(`${API_ENDPOINTS.QUIZZES.LIST}?lesson=${lessonId}`),
  getQuiz: (id) => axiosInstance.get(API_ENDPOINTS.QUIZZES.DETAIL(id)),
  submitQuiz: (id, answers) => axiosInstance.post(API_ENDPOINTS.QUIZZES.SUBMIT(id), { answers }),
};

export default quizzesService;
