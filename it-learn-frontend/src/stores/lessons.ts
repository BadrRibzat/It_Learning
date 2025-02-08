import { defineStore } from 'pinia';
import LessonService from '@/services/lessons.service';
import type {
  Level,
  Lesson,
  Flashcard,
  Quiz,
  LevelTest,
  LevelProgress,
  LessonState,
  FlashcardAnswer,
  QuizSubmission,
  TestSubmission
} from '@/types/lessons';

export const useLessonsStore = defineStore('lessons', {
  state: (): LessonState => ({
    currentLevel: null,
    levels: [],
    currentLesson: null,
    lessons: [],
    currentFlashcard: null,
    flashcards: [],
    currentQuiz: null,
    levelProgress: null,
    levelTest: null,
    loading: false,
    error: null
  }),

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
    
    availableLevels: (state) => 
      state.levels.filter(level => level.is_unlocked),
    
    lessonProgress: (state) => (lessonId: string) => {
      if (!state.levelProgress) return null;
      const lesson = state.lessons.find(l => l.id === lessonId);
      return lesson?.progress || null;
    },

    canAccessQuiz: (state) => {
      if (!state.currentLesson) return false;
      return state.currentLesson.progress.quiz_unlocked;
    },

    canTakeLevelTest: (state) => {
      return state.levelProgress?.level_test_available || false;
    },

    nextLesson: (state) => {
      if (!state.currentLesson || !state.lessons.length) return null;
      const currentIndex = state.lessons.findIndex(
        lesson => lesson.id === state.currentLesson?.id
      );
      return currentIndex < state.lessons.length - 1 
        ? state.lessons[currentIndex + 1] 
        : null;
    }
  },

  actions: {
    // Level Management
    async fetchLevels() {
      try {
        this.loading = true;
        this.error = null;
        this.levels = await LessonService.getLevels();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch levels';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchCurrentLevel() {
      try {
        this.loading = true;
        this.error = null;
        this.currentLevel = await LessonService.getCurrentLevel();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch current level';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Lesson Management
    async fetchLessons(levelId: string) {
      try {
        this.loading = true;
        this.error = null;
        this.lessons = await LessonService.getLessons(levelId);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch lessons';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async setCurrentLesson(lesson: Lesson) {
      this.currentLesson = lesson;
      await this.fetchFlashcards(lesson.id);
    },

    // Flashcard Management
    async fetchFlashcards(lessonId: string) {
      try {
        this.loading = true;
        this.error = null;
        this.flashcards = await LessonService.getFlashcards(lessonId);
        if (this.flashcards.length > 0) {
          this.currentFlashcard = this.flashcards[0];
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch flashcards';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async submitFlashcardAnswer(lessonId: string, answer: FlashcardAnswer) {
      try {
        this.loading = true;
        this.error = null;
        const response = await LessonService.submitFlashcardAnswer(lessonId, answer);
        
        if (this.currentLesson) {
          this.currentLesson.progress = response.progress;
        }
        
        return response;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to submit answer';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Quiz Management
    async fetchQuiz(lessonId: string) {
      try {
        this.loading = true;
        this.error = null;
        this.currentQuiz = await LessonService.getQuiz(lessonId);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch quiz';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async submitQuiz(lessonId: string, submission: QuizSubmission) {
      try {
        this.loading = true;
        this.error = null;
        const response = await LessonService.submitQuiz(lessonId, submission);
        
        if (response.next_lesson_unlocked) {
          await this.fetchLessons(this.currentLevel?.id || '');
        }
        
        return response;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to submit quiz';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Add this method to src/stores/lessons.ts
    async completeLesson(lessonId: string) {
      try {
        this.loading = true;
        this.error = null;
        await LessonService.completeLesson(lessonId);

        // Update lesson progress
        if (this.currentLesson) {
         this.currentLesson.progress.quiz_unlocked = true;
        }

        return true;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to complete lesson';
        throw error;
      } finally {
       this.loading = false;
      }
    },

    // Level Test Management
    async fetchLevelTest(levelId: string) {
      try {
        this.loading = true;
        this.error = null;
        this.levelTest = await LessonService.getLevelTest(levelId);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch level test';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async submitLevelTest(levelId: string, submission: TestSubmission) {
      try {
        this.loading = true;
        this.error = null;
        const response = await LessonService.submitLevelTest(levelId, submission);
        
        if (response.next_level_unlocked) {
          await this.fetchLevels();
          await this.fetchCurrentLevel();
        }
        
        return response;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to submit level test';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Progress Tracking
    async fetchLevelProgress(levelId: string) {
      try {
        this.loading = true;
        this.error = null;
        this.levelProgress = await LessonService.getLevelProgress(levelId);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch progress';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Reset Store
    resetState() {
      this.currentLevel = null;
      this.levels = [];
      this.currentLesson = null;
      this.lessons = [];
      this.currentFlashcard = null;
      this.flashcards = [];
      this.currentQuiz = null;
      this.levelProgress = null;
      this.levelTest = null;
      this.loading = false;
      this.error = null;
    }
  }
});
