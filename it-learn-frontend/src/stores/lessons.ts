import { defineStore } from 'pinia';
import LessonService from '../services/lessons.service';
import type {
  Level,
  Lesson,
  Flashcard,
  Quiz,
  TestSubmission,
  LevelProgress,
  FlashcardAnswer,
  FlashcardSubmissionResponse,
  QuizSubmissionResponse,
  TestSubmissionResponse,
} from '@/types/lessons';
import { useProfileStore } from '@/stores/profile';
import { storeToRefs } from 'pinia';

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
    levelProgressMap: {} as Record<string, LevelProgress>,
    levelTest: null as any,
    loading: false,
    error: null as string | null,
  }),
  getters: {
    // Getter to check if all flashcards in a lesson are completed
    isFlashcardsCompleted(state): (lessonId: string) => boolean {
      return (lessonId: string) => {
        const lesson = state.lessons.find(l => l.id === lessonId);
        return !!lesson && lesson.progress.completed_flashcards >= 10;
      };
    },
    // Getter to check if a quiz is unlocked for a lesson
    isQuizUnlocked(state): (lessonId: string) => boolean {
      return (lessonId: string) => {
        const lesson = state.lessons.find(l => l.id === lessonId);
        return !!lesson && lesson.progress.quiz_unlocked;
      };
    },
    // Getter to check if a level test is available
    isLevelTestAvailable(state): (levelId: string) => boolean {
      return (levelId: string) => {
        const progress = state.levelProgressMap[levelId];
        return !!progress && progress.completed_lessons === progress.total_lessons;
      };
    },
  },
  actions: {
    async getLevels() {
      this.loading = true;
      try {
        const levelsResponse = await LessonService.getLevels();
        this.levels = Array.isArray(levelsResponse.levels) ? levelsResponse.levels : [];
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
        this.lessons = Array.isArray(lessons) ? lessons : [];
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
        this.flashcards = Array.isArray(flashcards) ? flashcards : [];
        this.lessonFlashcards.set(lessonId, this.flashcards);
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

    async updateLocalProgress(levelId: string, progress: LevelProgress) {
      this.levelProgressMap = {
        ...this.levelProgressMap,
        [levelId]: progress,
      };
    },

    async submitFlashcardAnswer(lessonId: string, answer: FlashcardAnswer): Promise<FlashcardSubmissionResponse> {
      this.loading = true;
      try {
        const response = await LessonService.submitFlashcardAnswer(lessonId, answer);

        // Update local progress
        const lesson = this.lessons.find(l => l.id === lessonId);
        if (lesson) {
          lesson.progress = response.progress;
          this.updateLocalProgress(lesson.level_id, response.level_progress || {});
        }

        // Automatically redirect to quiz if all flashcards are completed
        if (response.progress.completed_flashcards >= 10 && response.progress.quiz_unlocked) {
          this.currentQuiz = await this.getQuiz(lesson.level_id, lessonId);
        }

        // Update profile points
        const profileStore = useProfileStore();
        await profileStore.updatePoints(response.points_earned);

        return response;
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message;
        } else {
          this.error = 'Unknown error';
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getQuiz(levelId: string, lessonId: string): Promise<Quiz> {
      this.loading = true;
      try {
        const quiz = await LessonService.getQuiz(lessonId);
        this.currentQuiz = quiz;
        return quiz;
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message;
        } else {
          this.error = 'Unknown error';
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async submitQuiz(submission: QuizSubmission): Promise<QuizSubmissionResponse> {
      this.loading = true;
      try {
        const response = await LessonService.submitQuiz(submission.lessonId, submission);

        // Update lesson completion status
        const lesson = this.lessons.find(l => l.id === submission.lessonId);
        if (lesson) {
          lesson.completed = response.passed;
        }

        // Update profile points
        const profileStore = useProfileStore();
        await profileStore.updatePoints(response.points_earned);

        return response;
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message;
        } else {
          this.error = 'Unknown error';
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getLevelTest(levelId: string): Promise<void> {
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
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async submitLevelTest(levelId: string, submission: TestSubmission): Promise<TestSubmissionResponse> {
      this.loading = true;
      try {
        const response = await LessonService.submitLevelTest(levelId, submission);

        // Update level progress and unlock next level if passed
        if (response.next_level_unlocked) {
          const { currentLevel } = storeToRefs(this);
          const nextLevel = this.levels.find(l => l.order === currentLevel.value?.order + 1);
          if (nextLevel) {
            this.currentLevel = nextLevel;
          }
        }

        return response;
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message;
        } else {
          this.error = 'Unknown error';
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getLevelProgress(levelId: string): Promise<LevelProgress> {
      this.loading = true;
      try {
        const progress = await LessonService.getLevelProgress(levelId);
        this.levelProgress = progress;
        this.updateLocalProgress(levelId, progress);
        return progress;
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message;
        } else {
          this.error = 'Unknown error';
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },

    groupFlashcardsByLesson(flashcards: Flashcard[]): Map<string, Flashcard[]> {
      return flashcards.reduce((acc, flashcard) => {
        const lessonId = flashcard.lesson_id;
        if (!acc.has(lessonId)) {
          acc.set(lessonId, []);
        }
        acc.get(lessonId)?.push(flashcard);
        return acc;
      }, new Map<string, Flashcard[]>());
    },

    async saveQuizProgress(lessonId: string, progress: any): Promise<void> {
      console.log(`Saving quiz progress for lesson ${lessonId}:`, progress);
    },

    async unlockAllLessonsForBeginnerLevel(): Promise<void> {
      const beginnerLevel = this.levels.find(level => level.name === 'beginner');
      if (beginnerLevel) {
        await this.getLessons(beginnerLevel.id);
        this.lessons.forEach(lesson => {
          lesson.completed = true;
          lesson.progress = { completed_flashcards: 10, total_flashcards: 10, quiz_unlocked: true };
        });
      }
    },

    async redirectToLevelTest(levelId: string): Promise<string | null> {
    const accessInfo = await LessonService.checkLevelAccess(levelId);
    if (accessInfo.requiresTest) {
        return `/levels/${levelId}/test`;
    }
    return null;
}
    },
  },
});
