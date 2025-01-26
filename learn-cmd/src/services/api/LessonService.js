import apiClient from './apiClient';

export default {
  // Existing methods
  async getLevelProgression() {
    try {
      const response = await apiClient.get('/lessons/levels/progression');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async submitFlashcardAnswer(lessonId, answerData) {
    try {
      const response = await apiClient.post(
        `/lessons/flashcards/${lessonId}/submit`,
        answerData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // New methods for lessons and quizzes
  async getNextFlashcard(level) {
    try {
      const response = await apiClient.get(`/lessons/${level}/flashcards/next`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getQuizQuestions(level) {
    try {
      const response = await apiClient.get(`/lessons/${level}/quiz`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async submitQuiz(level, answers) {
    try {
      const response = await apiClient.post(`/lessons/${level}/quiz/submit`, {
        answers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async checkLevelTestEligibility(level) {
    try {
      const response = await apiClient.get(`/lessons/${level}/test/eligibility`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getLevelTestQuestions(level) {
    try {
      const response = await apiClient.get(`/lessons/${level}/test`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async submitLevelTest(level, answers) {
    try {
      const response = await apiClient.post(`/lessons/${level}/test/submit`, {
        answers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
