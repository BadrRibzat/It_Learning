import axiosInstance from './axios';

const quizzesService = {
  submitQuiz: (id, answers) => axiosInstance.post(`/quiz-submit/${id}/`, { answers }),
};

export default quizzesService;
