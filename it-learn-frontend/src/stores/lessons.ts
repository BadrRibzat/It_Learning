import { defineStore } from 'pinia';
import LessonService from '../services/lessons.service';
import type {
  Level,
  Lesson,
  Flashcard,
  Quiz,
  TestSubmission,
  LevelProgress,
} from '@/types/lessons';

export const useLessonsStore = defineStore('lessons', {
  state: () => ({
    currentLevel: null as Level | null,
    levels: [] as Level[],
    lessonFlashcards: new Map<string, Flashcard[]>(),
    currentLesson: null as Lesson | null,
    lessons: [] as Lesson[],
    currentFlashcard: null as Flashcard | null,
    flashcards: [] as Flashcard[],
    currentQuiz: null as Quiz | null,
    levelProgress: null as LevelProgress | null,
    levelTest: null as any,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    // Add getters here if needed
  },

  actions: {
    async getLevels() {
      this.loading = true;
      try {
        const levelsResponse = await LessonService.getLevels();
        this.levels = Array.isArray(levelsResponse.levels) ? levelsResponse.levels : []; // Ensure levels is an array
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message;
        } else {
          this.error = 'Unknown error';
        }
      } finally {
        this.loading = false;
      }
    },

    async getCurrentLevel() {
      this.loading = true;
      try {
        const level = await LessonService.getCurrentLevel();
        this.currentLevel = level;
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message;
        } else {
          this.error = 'Unknown error';
        }
      } finally {
        this.loading = false;
      }
    },

    async getLessons(levelId: string) {
      this.loading = true;
      try {
        const lessons = await LessonService.getLessons(levelId);
        this.lessons = Array.isArray(lessons) ? lessons : []; // Ensure lessons is an array
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message;
        } else {
          this.error = 'Unknown error';
        }
      } finally {
        this.loading = false;
      }
    },

    async getFlashcards(lessonId: string) {
      this.loading = true;
      try {
        const flashcards = await LessonService.getFlashcards(lessonId);
        this.flashcards = Array.isArray(flashcards) ? flashcards : []; // Ensure flashcards is an array
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message;
        } else {
          this.error = 'Unknown error';
        }
      } finally {
        this.loading = false;
      }
    },

    async submitFlashcardAnswer(lessonId: string, answer: FlashcardAnswer) {
      this.loading = true;
      try {
        const response = await LessonService.submitFlashcardAnswer(lessonId, answer);
        return response;
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message;
        } else {
          this.error = 'Unknown error';
        }
      } finally {
        this.loading = false;
      }
    },

    async getQuiz(lessonId: string) {
      this.loading = true;
      try {
        const quiz = await LessonService.getQuiz(lessonId);
        this.currentQuiz = quiz;
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message;
        } else {
          this.error = 'Unknown error';
        }
      } finally {
        this.loading = false;
      }
    },

    async submitQuiz(submission: QuizSubmission) {
      this.loading = true;
      try {
        const response = await LessonService.submitQuiz(submission.lessonId, submission);
        return response;
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message;
        } else {
          this.error = 'Unknown error';
        }
      } finally {
        this.loading = false;
      }
    },

    async getLevelTest(levelId: string) {
      this.loading = true;
      try {
        const test = await LessonService.getLevelTest(levelId);
        this.levelTest = test;
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message;
        } else {
          this.error = 'Unknown error';
        }
      } finally {
        this.loading = false;
      }
    },

    async submitLevelTest(levelId: string, submission: TestSubmission) {
      this.loading = true;
      try {
        const response = await LessonService.submitLevelTest(levelId, submission);
        return response;
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message;
        } else {
          this.error = 'Unknown error';
        }
      } finally {
        this.loading = false;
      }
    },

    async getLevelProgress(levelId: string) {
      this.loading = true;
      try {
        const progress = await LessonService.getLevelProgress(levelId);
        this.levelProgress = progress;
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message;
        } else {
          this.error = 'Unknown error';
        }
      } finally {
        this.loading = false;
      }
    },

    groupFlashcardsByLesson(flashcards: Flashcard[]): Map<string, Flashcard[]> {
      return flashcards.reduce((acc, flashcard) => {
        const lessonId = flashcard.id;
        if (!acc.has(lessonId)) {
          acc.set(lessonId, []);
        }
        acc.get(lessonId)?.push(flashcard);
        return acc;
      }, new Map<string, Flashcard[]>());
    },

    async saveQuizProgress(lessonId: string, progress: any) {
      // TODO: Implement the logic to save quiz progress
      console.log(`Saving quiz progress for lesson ${lessonId}:`, progress);
    },

    async unlockAllLessonsForBeginnerLevel() {
      const beginnerLevel = this.levels.find(level => level.name === 'beginner');
      if (beginnerLevel) {
        await this.getLessons(beginnerLevel.id);
        this.lessons.forEach(lesson => {
          lesson.completed = true;
        });
      }
    },

    async redirectToLevelTest(levelId: string) {
      const level = this.levels.find(level => level.id === levelId);
      if (level && level.progress >= 0.8) {
        return `/levels/${levelId}/test`;
      }
      return null;
    }
  },
});
