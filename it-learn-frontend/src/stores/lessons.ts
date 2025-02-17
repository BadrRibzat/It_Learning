import { defineStore } from 'pinia';
import LessonService from '../services/lessons.service';
import type { Level, Lesson, Flashcard, Quiz } from '../types/lessons';
import { useProfileStore } from '../stores/profile';

export const useLessonsStore = defineStore('lessons', {
  state: () => ({
    levels: [] as Level[],
    lessons: [] as Lesson[],
    currentLesson: null as Lesson | null,
    flashcards: [] as Flashcard[],
    currentQuiz: null as Quiz | null,
    loading: false,
    error: null as string | null,
    levelProgressMap: {} as Record<string, { completed_lessons: number; total_lessons: number }>,
  }),

  actions: {
    handleError(error: unknown) {
      this.loading = false;
      if (error instanceof Error) {
        this.error = error.message;
      } else {
        this.error = 'An unexpected error occurred.';
      }
      console.error(error);
    },

    async getLevels(): Promise<void> {
      this.loading = true;
      try {
        this.levels = await LessonService.getLevels();
        // All levels are accessible by default
        this.levels.forEach((level) => (level.is_unlocked = true));

        // Initialize levelProgressMap
        this.levelProgressMap = this.levels.reduce((map, level) => {
          map[level.id] = { completed_lessons: 0, total_lessons: 0 };
          return map;
        }, {} as Record<string, { completed_lessons: number; total_lessons: number }>);
      } catch (error) {
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },

    async getLessons(levelId: string): Promise<void> {
      this.loading = true;
      try {
        const lessons = await LessonService.getLessons(levelId);
        this.lessons = lessons.map(lesson => ({
          ...lesson,
          progress: lesson.progress || { completed: false, points: 0, total_points: 0 }
        }));
        console.log('Lessons data:', lessons); // Add this line
      } catch (error) {
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },

    async getFlashcards(lessonId: string): Promise<void> {
      this.loading = true;
      try {
        this.flashcards = await LessonService.getFlashcards(lessonId);
      } catch (error) {
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },

    async completeLesson(lessonId: string): Promise<void> {
      try {
        await LessonService.completeLesson(lessonId);

        const profileStore = useProfileStore();
        profileStore.updatePoints(10);

        const lesson = this.lessons.find((l) => l.id === lessonId);
        if (lesson) {
          lesson.completed = true;
          lesson.progress = { completed: true, points: 10, total_points: 10 };
        }
      } catch (error) {
        this.handleError(error);
      }
    },
  },
});
