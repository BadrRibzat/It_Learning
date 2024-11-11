import axiosInstance from './axios';
import { API_ENDPOINTS } from '@/config';

const flashcardsService = {
  getFlashcards(params = {}) {
    const { lessonId, includeDetails = false } = params;
    
    // Construct query parameters
    const queryParams = new URLSearchParams();
    if (lessonId) queryParams.append('lesson', lessonId);
    if (includeDetails) queryParams.append('include_details', 'true');

    return axiosInstance.get(`${API_ENDPOINTS.FLASHCARDS.LIST}?${queryParams.toString()}`);
  },
  
  getFlashcard(id, includeDetails = false) {
    if (!id) {
      throw new Error('Flashcard ID is required');
    }
    
    const queryParams = new URLSearchParams();
    if (includeDetails) queryParams.append('include_details', 'true');

    return axiosInstance.get(`${API_ENDPOINTS.FLASHCARDS.DETAIL(id)}?${queryParams.toString()}`);
  },
  
  submitFlashcard(id, answer) {
    if (!id || !answer) {
      throw new Error('Flashcard ID and answer are required');
    }
    
    return axiosInstance.post(API_ENDPOINTS.FLASHCARDS.SUBMIT(id), { answer });
  },

  // Additional method for comprehensive flashcard retrieval
  async getFlashcardsWithDetails(lessonId) {
    if (!lessonId) {
      throw new Error('Lesson ID is required');
    }

    try {
      const [flashcardsResponse, lessonResponse] = await Promise.all([
        this.getFlashcards({ lessonId, includeDetails: true }),
        axiosInstance.get(`/lessons/${lessonId}/`)
      ]);

      return {
        flashcards: flashcardsResponse.data,
        lesson: lessonResponse.data
      };
    } catch (error) {
      console.error('Failed to fetch flashcards with details:', error);
      throw error;
    }
  }
};

export default flashcardsService;
