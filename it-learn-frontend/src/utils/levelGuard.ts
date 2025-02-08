import type { RouteLocationNormalized } from 'vue-router';
import { useLessonsStore } from '@/stores/lessons';

export async function levelGuard(to: RouteLocationNormalized) {
  const lessonsStore = useLessonsStore();
  const levelId = to.params.levelId as string;
  const lessonId = to.params.lessonId as string;

  try {
    // Fetch necessary data
    await lessonsStore.fetchLevels();
    const level = lessonsStore.levels.find(l => l.id === levelId);

    // Check if level exists
    if (!level) {
      return { 
        name: 'not-found',
        params: { message: 'Level not found' }
      };
    }

    // Check if level is unlocked
    if (!level.is_unlocked) {
      return { 
        name: 'learning-dashboard',
        query: { 
          error: 'This level is locked. Complete the previous level first.'
        }
      };
    }

    // If accessing a lesson, check lesson access
    if (lessonId) {
      await lessonsStore.fetchLessons(levelId);
      const lesson = lessonsStore.lessons.find(l => l.id === lessonId);

      if (!lesson) {
        return { 
          name: 'not-found',
          params: { message: 'Lesson not found' }
        };
      }

      if (!lesson.is_unlocked) {
        return {
          name: 'level',
          params: { levelId },
          query: {
            error: 'Complete previous lessons first to unlock this one.'
          }
        };
      }
    }

    // Check level test access
    if (to.name === 'level-test' && !lessonsStore.canTakeLevelTest) {
      return {
        name: 'level',
        params: { levelId },
        query: {
          error: 'Complete all lessons and quizzes before taking the level test.'
        }
      };
    }

    return true;
  } catch (error) {
    console.error('Level guard error:', error);
    return { 
      name: 'learning-dashboard',
      query: { 
        error: 'Something went wrong. Please try again.'
      }
    };
  }
}
