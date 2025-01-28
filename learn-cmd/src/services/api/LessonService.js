import apiClient from './apiClient';

export default {
  // Level and Progress
  async getLevelProgression() {
    try {
      const response = await apiClient.get('/lessons/levels/progression');
      return response.data;
    } catch (error) {
      console.error('Level progression error:', error);
      // Return default progression if not found
      return {
        current_level: 'beginner',
        next_level: 'intermediate',
        progress: 0,
        unlocked_levels: ['beginner']
      };
    }
  },

  // Lesson Operations
  async getLessonsByLevel(level) {
    try {
      const response = await apiClient.get(`/lessons/${level}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Flashcard Operations
  async getFlashcardsForLesson(lessonId) {
    try {
      const response = await apiClient.get(`/lessons/${lessonId}/flashcards`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  async submitFlashcardAnswer(lessonId, answerData) {
    try {
      const response = await apiClient.post(`/lessons/flashcards/${lessonId}/submit`, {
        flashcard_id: answerData.flashcardId,
        user_answer: answerData.userAnswer,
        expected_answer: answerData.expectedAnswer
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Quiz Operations
  async getQuizForLesson(lessonId) {
    try {
      const response = await apiClient.get(`/lessons/${lessonId}/quiz`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  async submitQuizAnswers(lessonId, answers) {
    try {
      const response = await apiClient.post(`/lessons/${lessonId}/quiz/submit`, {
        answers: answers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Level Test Operations
  async getLevelTest(level) {
    try {
      const response = await apiClient.get(`/lessons/${level}/test`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  async submitLevelTest(level, answers) {
    try {
      const response = await apiClient.post(`/lessons/${level}/test/submit`, {
        answers: answers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  }
};
