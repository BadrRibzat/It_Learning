import apiClient from './apiClient';

export default {
  async getLessonProgress(lessonId) {
    try {
      const response = await apiClient.get(`/progress/lesson/${lessonId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getOverallProgress() {
    try {
      const response = await apiClient.get('/progress/overall');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getFlashcardProgress() {
    try {
      const response = await apiClient.get('/progress/flashcards');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getQuizProgress() {
    try {
      const response = await apiClient.get('/progress/quizzes');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getLevelProgress() {
    try {
      const response = await apiClient.get('/progress/levels');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async trackProgress(progressData) {
    try {
      const response = await apiClient.post('/progress/track', progressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
