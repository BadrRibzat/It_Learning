import axiosInstance from '../axios';

export const quizzesService = {
  fetchQuizzes: async () => {
    const response = await axiosInstance.get('quizzes/');
    return response.data;
  },
  fetchQuiz: async (id) => {
    const response = await axiosInstance.get(`quizzes/${id}/`);
    return response.data;
  },
  submitQuiz: async (id, answers) => {
    const response = await axiosInstance.post(`quiz-submit/${id}/`, { answers });
    return response.data;
  },
};
