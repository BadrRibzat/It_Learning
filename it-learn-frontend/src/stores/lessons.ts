import { defineStore } from 'pinia';
import LessonService from '../services/lessons.service';
import { ProgressTracker } from '../utils/progressTracker';
import type {
  Level,
  Lesson,
  Flashcard,
  Quiz,
  TestSubmission,
  LevelProgress,
} from '../types/lessons';
import { useProfileStore } from '../stores/profile';
import router from '../router';

export const useLessonsStore = defineStore('lessons', {
  state: () => ({
    currentLevel: null as Level | null,
    levels: [] as Level[],
    levelAccess: {} as Record<string, {
      has_access: boolean;
      requires_test: boolean;
      redirect_url: string | null;
      test_id: string | null;
    }>,
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

  actions: {
    async getLevels(): Promise<void> {
      this.loading = true;
      try {
        const levelsResponse = await LessonService.getLevels();
        this.levels = Array.isArray(levelsResponse.levels) ? levelsResponse.levels : [];

        // All levels are unlocked by default
        this.levels.forEach(level => {
          level.is_unlocked = true;
        });
      } catch (error: unknown) {
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },

    async completeLesson(lessonId: string): Promise<void> {
      try {
        await LessonService.completeLesson(lessonId);
        
        await ProgressTracker.updateProgress('lesson', {
          completed: true,
          points: 10
        });

        // Update local state
        const lesson = this.lessons.find(l => l.id === lessonId);
        if (lesson) {
          lesson.completed = true;
          lesson.progress = {
            completed: true,
            points: 10,
            total_points: 10
          };
        }
      } catch (error) {
        this.handleError(error);
      }
    },

    async submitLevelTest(levelId: string, submission: TestSubmission): Promise<void> {
      this.loading = true;
      try {
        const response = await LessonService.submitLevelTest(levelId, submission);
        
        await ProgressTracker.updateProgress('level_test', {
          submitted: true,
          score: response.score,
          passed: response.score >= 80,
          points_earned: response.points_earned
        });

        // Auto-redirect based on test score
        if (response.score >= 80) {
          router.push({
            name: 'level',
            params: { levelId }
          });
        }
      } catch (error) {
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },

    async getLevelProgress(levelId: string): Promise<void> {
      this.loading = true;
      try {
        const progress = await LessonService.getLevelProgress(levelId);
        this.levelProgress = progress;
        this.levelProgressMap[levelId] = progress;
        
        // Update lessons completion status
        if (progress && this.lessons) {
          this.lessons.forEach(lesson => {
            const lessonProgress = progress.lessons_progress.find(p => p.lesson_id === lesson.id);
            if (lessonProgress) {
              lesson.completed = lessonProgress.completed;
              lesson.progress = {
                completed: lessonProgress.completed,
                points: lessonProgress.points,
                total_points: 10
              };
            }
          });
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message;
        }
      } finally {
        this.loading = false;
      }
    },

    async getCurrentLevel(): Promise<Level | null> {
      this.loading = true;
      try {
        // Get the most recently accessed level with progress
        for (const level of this.levels) {
          const progress = this.levelProgressMap[level.id];
          if (progress && progress.current_level) {
            this.currentLevel = level;
            return level;
          }
        }
        // If no level with progress found, return beginner level
        const beginnerLevel = this.levels.find(level => level.order === 1);
        if (beginnerLevel) {
          this.currentLevel = beginnerLevel;
          return beginnerLevel;
        }
        return null;
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message;
        }
        return null;
      } finally {
        this.loading = false;
      }
    },

    async checkLevelAccess(levelId: string): Promise<LevelAccess> {
      return ProgressTracker.checkLevelAccess(levelId);
    }
  }
});
