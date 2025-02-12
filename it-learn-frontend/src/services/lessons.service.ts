import axios, { AxiosError, isAxiosError } from 'axios';
import type { AxiosResponse } from 'axios';
import type {
  Level,
  Lesson,
  Flashcard,
  Quiz,
  QuizSubmission,
  QuizSubmissionResponse,
  FlashcardAnswer,
  FlashcardSubmissionResponse,
  LevelTest,
  TestSubmission,
  TestSubmissionResponse,
  LevelProgress
} from '@/types/lessons';
import { notifyError } from '@/utils/notifications';

const API_URL = import.meta.env.VITE_API_URL + '/lessons';

class LessonService {
  private static getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  static async getLevels(): Promise<Level[]> {
    try {
      const response: AxiosResponse<Level[]> = await axios.get(`${API_URL}/levels`, {
        headers: this.getAuthHeaders(),
      });
      console.log('API Levels Response:', response.data);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch levels');
      throw error;
    }
  }

  static async getCurrentLevel(): Promise<Level> {
    try {
      const response: AxiosResponse<Level> = await axios.get(`${API_URL}/levels/current`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch current level');
      throw error;
    }
  }

  // Lesson Management
  static async getLessons(levelId: string): Promise<Lesson[]> {
    try {
      const response: AxiosResponse<Lesson[]> = await axios.get(`${API_URL}/levels/${levelId}/lessons`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch lessons');
      throw error;
    }
  }

  // Flashcard Management
  static async getFlashcards(lessonId: string): Promise<Flashcard[]> {
    try {
      const response: AxiosResponse<Flashcard[]> = await axios.get(`${API_URL}/lessons/${lessonId}/flashcards`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch flashcards');
      throw error;
    }
  }

  static async submitFlashcardAnswer(lessonId: string, answer: FlashcardAnswer): Promise<FlashcardSubmissionResponse> {
    try {
      const response: AxiosResponse<FlashcardSubmissionResponse> = await axios.post(`${API_URL}/flashcards/${lessonId}/submit`, answer, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to submit flashcard answer');
      throw error;
    }
  }

  // Quiz Management
  static async getQuiz(lessonId: string): Promise<Quiz> {
    try {
      const response: AxiosResponse<Quiz> = await axios.get(`${API_URL}/lessons/${lessonId}/quiz`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch quiz');
      throw error;
    }
  }

  static async submitQuiz(lessonId: string, submission: QuizSubmission): Promise<QuizSubmissionResponse> {
    try {
      const response: AxiosResponse<QuizSubmissionResponse> = await axios.post(`${API_URL}/lessons/${lessonId}/quiz`, submission, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || 'Failed to submit quiz';
        throw new Error(message);
      }
      throw error;
    }
  }

  // Level Test Management
  static async getLevelTest(levelId: string): Promise<LevelTest> {
    try {
      const response: AxiosResponse<LevelTest> = await axios.get(`${API_URL}/levels/${levelId}/test`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch level test');
      throw error;
    }
  }

  static async completeLesson(lessonId: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/lessons/${lessonId}/complete`, null, {
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      this.handleError(error, 'Failed to complete lesson');
      throw error;
    }
  }

  static async submitLevelTest(levelId: string, submission: TestSubmission): Promise<TestSubmissionResponse> {
    try {
      const response: AxiosResponse<TestSubmissionResponse> = await axios.post(`${API_URL}/levels/${levelId}/test`, submission, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to submit level test');
      throw error;
    }
  }

  // Progress Tracking
  static async getLevelProgress(levelId: string): Promise<LevelProgress> {
    try {
      const response: AxiosResponse<LevelProgress> = await axios.get(`${API_URL}/progress/${levelId}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch level progress');
      throw error;
    }
  }

  // Error Handling
  static handleError(error: unknown, defaultMessage: string): void {
    const errorMessage = this.getErrorMessage(error, defaultMessage);
    notifyError(errorMessage);
    throw new Error(errorMessage);
  }

  static getErrorMessage(error: unknown, defaultMessage: string): string {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || error.message || defaultMessage;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return defaultMessage;
  }
}

export default LessonService;
