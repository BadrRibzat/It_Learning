import axiosInstance from './axios';

const quizzesService = {
  getQuizzes: (lessonId) => axiosInstance.get(`/quizzes/?lesson=${lessonId}`),
  getQuiz: (id) => axiosInstance.get(`/quizzes/${id}/`),
  submitQuiz: (id, answers) => axiosInstance.post(`/quiz-submit/${id}/`, { answers }),
};

export default quizzesService;
