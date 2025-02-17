import axios, { AxiosError, isAxiosError } from 'axios';
import type {
  Level,
  Lesson,
  Flashcard,
  Quiz,
  QuizSubmission,
  QuizSubmissionResponse,
  FlashcardAnswer,
  FlashcardSubmissionResponse,
} from '@/types/lessons';
import { notifyError } from '@/utils/notifications';

const API_URL = `${import.meta.env['VITE_APP_API_URL']}/lessons`;

class LessonService {
  private static getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No access token found');
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  private static handleError(error: unknown): void {
    if (isAxiosError(error)) {
      notifyError(`API error: ${error.response?.data?.message || error.message}`);
    } else if (error instanceof Error) {
      notifyError(`Error: ${error.message}`);
    } else {
      notifyError('An unexpected error occurred.');
    }
    throw error;
  }

  static async getLevels(): Promise<Level[]> {
    try {
      const response = await axios.get(`${API_URL}/levels`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  static async getLessons(levelId: string): Promise<Lesson[]> {
    try {
      const response = await axios.get(`${API_URL}/levels/${levelId}/lessons`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  static async getCurrentLevel(): Promise<Level | null> {
    try {
      const response = await axios.get(`${API_URL}/current-level`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  static async getFlashcards(lessonId: string): Promise<Flashcard[]> {
    try {
      const response = await axios.get(`${API_URL}/lessons/${lessonId}/flashcards`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  static async submitFlashcardAnswer(
    lessonId: string,
    answer: FlashcardAnswer
  ): Promise<FlashcardSubmissionResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/flashcards/${lessonId}/submit`,
        answer,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      return { correct: false, progress: { completed: false, points: 0, total_points: 0 }, points_earned: 0 };
    }
  }

  static async getQuiz(lessonId: string): Promise<Quiz> {
    try {
      const response = await axios.get(`${API_URL}/lessons/${lessonId}/quiz`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      return { id: '', lesson_id: '', questions: [], total_questions: 0, passing_score: 0.8 };
    }
  }

  static async submitQuiz(
    lessonId: string,
    submission: QuizSubmission
  ): Promise<QuizSubmissionResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/lessons/${lessonId}/quiz`,
        submission,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      return { score: 0, correct_answers: 0, total_questions: 0, passed: false, points_earned: 0 };
    }
  }

  static async completeLesson(lessonId: string): Promise<void> {
    try {
      await axios.post(
        `${API_URL}/lessons/${lessonId}/complete`,
        {},
        {
          headers: this.getAuthHeaders(),
        }
      );
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default LessonService;
