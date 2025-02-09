import axios from '@/utils/axios';
import type { AxiosResponse } from '@/utils/axios';
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

const API_URL = '/lessons';

class LessonService {
  // Level Management
  static async getLevels(): Promise<Level[]> {
    try {
      const response: AxiosResponse<Level[]> = await axios.get(`${API_URL}/levels`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch levels');
      throw error;
    }
  }

  static async getCurrentLevel(): Promise<Level> {
    try {
      const response: AxiosResponse<Level> = await axios.get(`${API_URL}/levels/current`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch current level');
      throw error;
    }
  }

  // Lesson Management
  static async getLessons(levelId: string): Promise<Lesson[]> {
    try {
      const response: AxiosResponse<Lesson[]> = 
        await axios.get(`${API_URL}/levels/${levelId}/lessons`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch lessons');
      throw error;
    }
  }

  // Flashcard Management
  static async getFlashcards(lessonId: string): Promise<Flashcard[]> {
    try {
      const response: AxiosResponse<Flashcard[]> = 
        await axios.get(`${API_URL}/lessons/${lessonId}/flashcards`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch flashcards');
      throw error;
    }
  }

  static async submitFlashcardAnswer(
    lessonId: string, 
    answer: FlashcardAnswer
  ): Promise<FlashcardSubmissionResponse> {
    try {
      const response: AxiosResponse<FlashcardSubmissionResponse> = 
        await axios.post(`${API_URL}/flashcards/${lessonId}/submit`, answer);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to submit flashcard answer');
      throw error;
    }
  }

  // Quiz Management
  static async getQuiz(lessonId: string): Promise<Quiz> {
    try {
      const response: AxiosResponse<Quiz> = 
        await axios.get(`${API_URL}/lessons/${lessonId}/quiz`);
    
      // Also fetch flashcards if needed
      const flashcardsResponse: AxiosResponse<Flashcard[]> = 
        await axios.get(`${API_URL}/lessons/${lessonId}/flashcards`);
    
      // Merge quiz questions with flashcard answers
      const quiz = response.data;
      const flashcards = flashcardsResponse.data;
    
      quiz.questions = quiz.questions.map(question => {
        const flashcard = flashcards.find(f => f.command === question.command);
        return {
          ...question,
          answer: flashcard?.answer || question.answer
        };
      });
    
      return quiz;
    } catch (error) {
      this.handleError(error, 'Failed to fetch quiz');
      throw error;
    }
  }

    static async submitQuiz(
      lessonId: string, 
      submission: QuizSubmission
    ): Promise<QuizSubmissionResponse> {
      try {
        const response: AxiosResponse<QuizSubmissionResponse> = 
          await axios.post(`${API_URL}/lessons/${lessonId}/quiz`, {
            answers: submission.answers,
            total_time: submission.total_time,
            score: submission.score
          });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || 'Failed to submit quiz';
          throw new Error(message);
        }
        throw error;
      }
    }

  // Level Test Management
  static async getLevelTest(levelId: string): Promise<LevelTest> {
    try {
      const response: AxiosResponse<LevelTest> = 
        await axios.get(`${API_URL}/levels/${levelId}/test`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch level test');
      throw error;
    }
  }

  static async completeLesson(lessonId: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/lessons/${lessonId}/complete`);
    } catch (error) {
      this.handleError(error, 'Failed to complete lesson');
      throw error;
    }
  }

  static async submitLevelTest(
    levelId: string, 
    submission: TestSubmission
  ): Promise<TestSubmissionResponse> {
    try {
      const response: AxiosResponse<TestSubmissionResponse> = 
        await axios.post(`${API_URL}/levels/${levelId}/test`, submission);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to submit level test');
      throw error;
    }
  }

  // Progress Tracking
  static async getLevelProgress(levelId: string): Promise<LevelProgress> {
    try {
      const response: AxiosResponse<LevelProgress> = 
        await axios.get(`${API_URL}/progress/${levelId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch level progress');
      throw error;
    }
  }

  // Error Handling
  private static handleError(error: unknown, defaultMessage: string): void {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error(errorMessage);
      throw new Error(errorMessage || defaultMessage);
    }
    console.error(defaultMessage);
    throw new Error(defaultMessage);
  }
}

export default LessonService;
