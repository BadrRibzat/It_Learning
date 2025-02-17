import axiosInstance, { AxiosError } from '@/utils/axios';
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

const API_URL = '/lessons';

class LessonService {
  private static handleError(error: unknown): void {
    if (error instanceof AxiosError) {
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
      const response = await axiosInstance.get(`${API_URL}/levels`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  static async getLessons(levelId: string): Promise<Lesson[]> {
    try {
      const response = await axiosInstance.get(`${API_URL}/levels/${levelId}/lessons`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  static async getFlashcards(lessonId: string): Promise<Flashcard[]> {
    try {
      const response = await axiosInstance.get(`${API_URL}/lessons/${lessonId}/flashcards`);
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
      const response = await axiosInstance.post(
        `${API_URL}/flashcards/${lessonId}/submit`,
        answer
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      return { correct: false, progress: { completed: false, points: 0, total_points: 0 }, points_earned: 0 };
    }
  }

  static async getQuiz(lessonId: string): Promise<Quiz> {
    try {
      const response = await axiosInstance.get(`${API_URL}/lessons/${lessonId}/quiz`);
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
      const response = await axiosInstance.post(
        `${API_URL}/lessons/${lessonId}/quiz`,
        submission
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      return { score: 0, correct_answers: 0, total_questions: 0, passed: false, points_earned: 0 };
    }
  }

  static async completeLesson(lessonId: string): Promise<void> {
    try {
      await axiosInstance.post(`${API_URL}/lessons/${lessonId}/complete`);
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default LessonService;
