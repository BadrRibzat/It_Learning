import axios, { AxiosError, isAxiosError, type AxiosResponse, type AxiosRequestConfig } from 'axios';
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

const API_URL = import.meta.env['VITE_APP_API_URL'] + '/lessons';

class LessonService {
  private static getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No access token found');
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  private static getErrorType(error: unknown): string {
    if (isAxiosError(error)) {
      return 'apiError';
    } else if (isAxiosError(error) && !error.response) {
      return 'networkError';
    } else if (error instanceof Error) {
      return 'genericError';
    } else {
      return 'unknownError';
    }
  }

  private static getErrorMessage(error: unknown, defaultMessage: string): string {
    if (isAxiosError(error)) {
      return error.response?.data?.message || error.message || defaultMessage;
    } else if (error instanceof Error) {
      return error.message;
    } else {
      return defaultMessage;
    }
  }

  private static getNotificationMessage(errorType: string, errorMessage: string): string {
    switch (errorType) {
      case 'apiError':
        return `API error: ${errorMessage}`;
      case 'networkError':
        return `Network error: ${errorMessage}`;
      default:
        return `Error: ${errorMessage}`;
    }
  }

  private static handleError(error: unknown, defaultMessage: string): void {
    const errorType = this.getErrorType(error);
    const errorMessage = this.getErrorMessage(error, defaultMessage);
    const notificationMessage = this.getNotificationMessage(errorType, errorMessage);

    notifyError(notificationMessage);

    if (errorType === 'networkError') {
      // Retry the request after a short delay
      setTimeout(() => {
        // Retry logic here
      }, 500);
    }

    throw new Error(errorMessage);
  }

  private static async makeRequest<T>(url: string, method: 'get' | 'post', data?: any, options?: { timeout?: number; retry?: number }): Promise<T> {
    console.log(`Making request to ${url} with method ${method}`);
    if (data) {
      console.log('Request data:', data);
    }
    if (options) {
      console.log('Request options:', options);
    }

    try {
      const config: AxiosRequestConfig = {
        method,
        url,
        headers: this.getAuthHeaders(),
        data,
      };

      if (options?.timeout !== undefined) {
        config.timeout = options.timeout;
      }

      const response = await axios(config);
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error making request:', error);
      console.error(LessonService.getErrorMessage(error, 'An error occurred'));
      this.handleError(error, 'Failed to make request');
      return null as T; // Add a return statement here
    } finally {
      console.log('Request completed');
    } // eslint-disable-line no-unused-vars
  }

  static async getLevels(): Promise<Level[]> {
    console.log('Fetching levels');
    return this.makeRequest(`${API_URL}/levels`, 'get');
  }

  static async getCurrentLevel(): Promise<Level> {
    return this.makeRequest(`${API_URL}/levels/current`, 'get');
  }

  static async getLessons(levelId: string): Promise<Lesson[]> {
    return this.makeRequest(`${API_URL}/levels/${levelId}/lessons`, 'get');
  }

  static async getFlashcards(lessonId: string): Promise<Flashcard[]> {
    return this.makeRequest(`${API_URL}/lessons/${lessonId}/flashcards`, 'get');
  }

  static async submitFlashcardAnswer(lessonId: string, answer: FlashcardAnswer): Promise<FlashcardSubmissionResponse> {
    return this.makeRequest(`${API_URL}/flashcards/${lessonId}/submit`, 'post', answer);
  }

  static async getQuiz(lessonId: string): Promise<Quiz> {
    return this.makeRequest(`${API_URL}/lessons/${lessonId}/quiz`, 'get');
  }

  static async submitQuiz(lessonId: string, submission: QuizSubmission): Promise<QuizSubmissionResponse> {
    return this.makeRequest(`${API_URL}/lessons/${lessonId}/quiz`, 'post', submission);
  }

  static async getLevelTest(levelId: string): Promise<LevelTest> {
    return this.makeRequest(`${API_URL}/levels/${levelId}/test`, 'get');
  }

  static async completeLesson(lessonId: string): Promise<void> {
    return this.makeRequest(`${API_URL}/lessons/${lessonId}/complete`, 'post');
  }

  static async submitLevelTest(levelId: string, submission: TestSubmission): Promise<TestSubmissionResponse> {
    return this.makeRequest(`${API_URL}/levels/${levelId}/test`, 'post', submission);
  }

  static async getLevelProgress(levelId: string): Promise<LevelProgress> {
    return this.makeRequest(`${API_URL}/progress/${levelId}`, 'get');
  }

  static async getLesson(lessonId: string): Promise<Lesson> {
    return this.makeRequest(`${API_URL}/lessons/${lessonId}`, 'get');
  }
}

export default LessonService;
