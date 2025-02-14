import axios from 'axios';
// Import Axios types using `import type` to avoid runtime inclusion
import type { AxiosError, AxiosResponse } from 'axios';
import type { AxiosRequestConfig } from 'axios';

// Import custom types
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
  LevelProgress,
} from '@/types/lessons';

// Import notification utility
import { notifyError } from '@/utils/notifications';

// Define API base URL
const API_URL = import.meta.env['VITE_APP_API_URL'] + '/lessons';

class LessonService {
  // Get authentication headers for API requests
  private static getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No access token found');
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // Determine the type of error (API, network, generic, etc.)
  private static getErrorType(error: unknown): string {
    if (axios.isAxiosError(error)) {
      return error.response ? 'apiError' : 'networkError';
    } else if (error instanceof Error) {
      return 'genericError';
    } else {
      return 'unknownError';
    }
  }

  // Extract a meaningful error message from the error object
  private static getErrorMessage(error: unknown, defaultMessage: string): string {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || error.message || defaultMessage;
    } else if (error instanceof Error) {
      return error.message;
    }
    return defaultMessage;
  }

  // Generate a user-friendly notification message based on the error type
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

  // Handle errors by notifying the user and optionally retrying the request
  private static handleError(error: unknown, defaultMessage: string): void {
    const errorType = this.getErrorType(error);
    const errorMessage = this.getErrorMessage(error, defaultMessage);
    const notificationMessage = this.getNotificationMessage(errorType, errorMessage);

    notifyError(notificationMessage);

    if (errorType === 'networkError') {
      setTimeout(() => {
        console.warn('Retrying request due to network error...');
      }, 500);
    }

    throw new Error(errorMessage);
  }

  // Generic method to make API requests
  private static async makeRequest<T = any>(
    url: string,
    method: 'get' | 'post',
    data?: any,
    options?: { timeout?: number; retry?: number }
  ): Promise<T> {
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

      const response: AxiosResponse<T> = await axios(config);
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error making request:', error);
      this.handleError(error, 'Failed to make request');
      return null as T; // Fallback for error handling
    } finally {
      console.log('Request completed');
    }
  }

  // Fetch all available levels with progression info
  static async getLevels(): Promise<{ levels: Level[] }> {
    console.log('Fetching levels');
    return this.makeRequest<{ levels: Level[] }>(`${API_URL}/levels`, 'get');
  }

  // Get the current level details for the user
  static async getCurrentLevel(): Promise<Level> {
    console.log('Fetching current level');
    return this.makeRequest<Level>(`${API_URL}/levels/current`, 'get');
  }

  // Get all lessons for a specific level
  static async getLessons(levelId: string): Promise<Lesson[]> {
    console.log(`Fetching lessons for level ${levelId}`);
    return this.makeRequest<Lesson[]>(`${API_URL}/levels/${levelId}/lessons`, 'get');
  }

  // Get all flashcards for a specific lesson
  static async getFlashcards(lessonId: string): Promise<Flashcard[]> {
    console.log(`Fetching flashcards for lesson ${lessonId}`);
    return this.makeRequest<Flashcard[]>(`${API_URL}/lessons/${lessonId}/flashcards`, 'get');
  }

  // Submit an answer for a flashcard and track progress
  static async submitFlashcardAnswer(
    lessonId: string,
    answer: FlashcardAnswer
  ): Promise<FlashcardSubmissionResponse> {
    console.log(`Submitting flashcard answer for lesson ${lessonId}`);
    const response = await this.makeRequest<FlashcardSubmissionResponse>(
      `${API_URL}/flashcards/${lessonId}/submit`,
      'post',
      answer
    );

    if (
      response.progress.completed_flashcards >= 10 &&
      response.progress.quiz_unlocked
    ) {
      console.log('All flashcards completed. Redirecting to quiz.');
      return { ...response, redirect_to_quiz: true };
    }

    return response;
  }

  // Get quiz questions for a specific lesson
  static async getQuiz(lessonId: string): Promise<Quiz> {
    console.log(`Fetching quiz for lesson ${lessonId}`);
    return this.makeRequest<Quiz>(`${API_URL}/lessons/${lessonId}/quiz`, 'get');
  }

  // Submit answers for a quiz and process results
  static async submitQuiz(
    lessonId: string,
    submission: QuizSubmission
  ): Promise<QuizSubmissionResponse> {
    console.log(`Submitting quiz for lesson ${lessonId}`);
    return this.makeRequest<QuizSubmissionResponse>(
      `${API_URL}/lessons/${lessonId}/quiz`,
      'post',
      submission
    );
  }

  // Get level test questions for a specific level
  static async getLevelTest(levelId: string): Promise<LevelTest> {
    console.log(`Fetching level test for level ${levelId}`);
    return this.makeRequest<LevelTest>(`${API_URL}/levels/${levelId}/test`, 'get');
  }

  // Submit answers for a level test and process results
  static async submitLevelTest(
    levelId: string,
    submission: TestSubmission
  ): Promise<TestSubmissionResponse> {
    console.log(`Submitting level test for level ${levelId}`);
    return this.makeRequest<TestSubmissionResponse>(
      `${API_URL}/levels/${levelId}/test`,
      'post',
      submission
    );
  }

  // Get detailed progress for a specific level
  static async getLevelProgress(levelId: string): Promise<LevelProgress> {
    console.log(`Fetching progress for level ${levelId}`);
    return this.makeRequest<LevelProgress>(`${API_URL}/progress/${levelId}`, 'get');
  }

  // Get details for a specific lesson
  static async getLesson(lessonId: string): Promise<Lesson> {
    console.log(`Fetching lesson details for lesson ${lessonId}`);
    return this.makeRequest<Lesson>(`${API_URL}/lessons/${lessonId}`, 'get');
  }

  // Check if a level test is required for accessing a specific level
  static async checkLevelAccess(levelId: string): Promise<{ requiresTest: boolean; testId?: string }> {
    console.log(`Checking access for level ${levelId}`);
    try {
        const response = await this.makeRequest<{ has_access: boolean; requires_test: boolean; test_id?: string }>(
            `${API_URL}/levels/${levelId}/access`,
            'get'
        );

        if (response.requires_test && response.test_id) {
            return { requiresTest: true, testId: response.test_id };
        }

        return { requiresTest: false };
    } catch (error) {
        console.error('Error checking level access:', error);
        this.handleError(error, 'Failed to check level access');
        return { requiresTest: false };
    }
}
}

export default LessonService;
