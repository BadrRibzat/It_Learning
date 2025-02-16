import { useLessonsStore } from '@/stores/lessons';
import type { LevelAccess } from '@/types/lessons';

export class ProgressTracker {
  static async checkLevelAccess(levelId: string): Promise<LevelAccess> {
    const lessonsStore = useLessonsStore();

    // Beginner level is always accessible without any test
    if (levelId === 'beginner') {
      return {
        has_access: true,
        requires_test: false,
        redirect_url: null,
        test_id: null,
        error: null
      };
    }

    // For other levels (Intermediate, Advanced, Expert)
    const level = lessonsStore.levels.find(l => l.id === levelId);
    if (!level) {
      return {
        has_access: false,
        requires_test: false,
        redirect_url: null,
        test_id: null,
        error: 'Level not found'
      };
    }

    // Get level progress from store
    const levelProgress = lessonsStore.levelProgressMap[levelId];

    // Check if test is required (not submitted or score < 80%)
    const requiresTest = !levelProgress?.test_status?.test_submitted || 
                        (levelProgress?.test_status?.highest_score ?? 0) < 80;
    return {
      has_access: !requiresTest, // Only allow access if test is not required
      requires_test: requiresTest,
      redirect_url: requiresTest ? `/level/${levelId}/test` : null,
      test_id: requiresTest ? levelId : null,
      error: null
    };
  }
}
