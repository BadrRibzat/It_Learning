import axiosInstance from '../axios';

export const quizzesService = {
  fetchQuizzes: async () => {
    try {
      const response = await axiosInstance.get('quizzes/');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  fetchQuiz: async (id) => {
    try {
      const response = await axiosInstance.get(`quizzes/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};
