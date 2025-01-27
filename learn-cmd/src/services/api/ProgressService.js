import apiClient from './apiClient';

export default {
  async getLessonProgress(lessonId) {
    try {
      const response = await apiClient.get(`/lessons/${lessonId}/progress`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  async trackFlashcardProgress(progressData) {
    try {
      const response = await apiClient.post('/progress/track', {
        lesson_id: progressData.lessonId,
        flashcard_id: progressData.flashcardId,
        is_correct: progressData.isCorrect
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  }
};
