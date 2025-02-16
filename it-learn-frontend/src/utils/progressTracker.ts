import { useLessonsStore } from '@/stores/lessons';
import type { LevelAccess } from '@/types/lessons';

export class ProgressTracker {
  static async checkLevelAccess(levelId: string): Promise<LevelAccess> {
    const lessonsStore = useLessonsStore();

    const level = lessonsStore.levels.find((l) => l.id === levelId);
    if (!level) {
      return {
        has_access: false,
        requires_test: false,
        redirect_url: null,
        test_id: null,
        error: 'Level not found',
      };
    }

    // All levels are accessible without any test
    return {
      has_access: true,
      requires_test: false,
      redirect_url: null,
      test_id: null,
      error: null,
    };
  }
}
