import axiosInstance from './axios';
import { API_ENDPOINTS } from '@/config';

const lessonsService = {
  getLessons(levelId = null) {
    // If no levelId, fetch all lessons
    const url = levelId 
      ? `/levels/${levelId}/lessons/`
      : API_ENDPOINTS.LESSONS.LIST;
    
    return axiosInstance.get(url);
  },
  
  getLesson(id) {
    if (!id) {
      throw new Error('Lesson ID is required');
    }
    return axiosInstance.get(API_ENDPOINTS.LESSONS.DETAIL(id));
  },
  
  recommendNextLesson() {
    return axiosInstance.get(API_ENDPOINTS.LESSONS.RECOMMEND);
  },

  // Additional method to get lesson details with associated resources
  async getLessonDetails(id) {
    if (!id) {
      throw new Error('Lesson ID is required');
    }

    try {
      const [lesson, quizzes, flashcards] = await Promise.all([
        this.getLesson(id),
        axiosInstance.get(`/quizzes/?lesson=${id}`),
        axiosInstance.get(`/flashcards/?lesson=${id}`)
      ]);

      return {
        lesson: lesson.data,
        quizzes: quizzes.data,
        flashcards: flashcards.data
      };
    } catch (error) {
      console.error('Failed to fetch lesson details:', error);
      throw error;
    }
  }
};

export default lessonsService;
