import { useProfileStore } from '../stores/profile';
import { useLessonsStore } from '../stores/lessons';
import { useNotificationStore } from '../stores/notification';
import type { LevelProgress } from '../types/lessons';
import { storeToRefs } from 'pinia';

interface LessonProgress {
  completed: boolean;
  points: number;
  total_flashcards: number;
  completed_flashcards: number;
}

interface TestProgress {
  submitted: boolean;
  score: number;
  passed: boolean;
  points_earned: number;
}

type ProgressData = LessonProgress | TestProgress;

interface LevelAccess {
  has_access: boolean;
  requires_test: boolean;
  redirect_url: string | null;
  test_id: string | null;
  error: string | null;
}

export class ProgressTracker {
  private static notificationStore = useNotificationStore();

  static async checkLevelAccess(levelId: string): Promise<LevelAccess> {
    const lessonsStore = useLessonsStore();

    // Allow access to all levels but handle test requirements
    if (levelId === 'beginner') {
      return {
        has_access: true,
        requires_test: false,
        redirect_url: null,
        test_id: null,
        error: null
      };
    }

    // For other levels, check if test is required
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

    // Check level test submission
    const levelProgress = lessonsStore.levelProgressMap[levelId];
    const requiresTest = !levelProgress?.test_status?.test_submitted || 
                        levelProgress?.test_status?.highest_score < 80;

    return {
      has_access: true, // Always allow access
      requires_test: requiresTest,
      redirect_url: requiresTest ? `/level/${levelId}/test` : null,
      test_id: requiresTest ? levelId : null,
      error: null
    };
  }

  static async updateProgress(type: string, data: ProgressData) {
    const profileStore = useProfileStore();
    const lessonsStore = useLessonsStore();

    try {
      switch (type) {
        case 'lesson':
          // Only track completed lessons now
          const lessonData = data as LessonProgress;
          if (lessonData.completed) {
            await profileStore.updatePoints(10); // Fixed 10 points per lesson
            this.notificationStore.success('Lesson completed! +10 points earned');
          }
          break;

        case 'level_test':
          const testData = data as TestProgress;
          if (testData.submitted) {
            if (testData.score >= 80) {
              await profileStore.updatePoints(50); // Bonus points for passing test
              this.notificationStore.success(
                `Level test passed! Score: ${testData.score}% (+50 points)`
              );
            } else {
              this.notificationStore.warning(
                `Level test not passed. Score: ${testData.score}%. Required: 80%. Try again!`
              );
            }
          }
          break;
      }
    } catch (error) {
      this.handleProgressError(error);
    }
  }

  static shouldUpdateAchievements(progress: LevelProgress): boolean {
    const milestones = {
      lessons: [5, 10, 25, 50, 100],
      levelTests: [1]
    };

    // Only update achievements when a level test is passed
    return (
      milestones.lessons.includes(progress.completed_lessons) ||
      (progress.test_status?.test_passed && milestones.levelTests.includes(progress.test_status?.attempts || 0))
    );
  }

  static formatProgressMessage(type: string, data: ProgressData): string {
    switch (type) {
      case 'lesson':
        const lessonData = data as LessonProgress;
        return `Lesson progress: ${lessonData.completed_flashcards}/${lessonData.total_flashcards} flashcards completed`;
      case 'level_test':
        const testData = data as TestProgress;
        return testData.submitted 
          ? `Level test ${testData.passed ? 'passed' : 'failed'}: ${testData.score}%`
          : 'Level test not yet submitted';
      default:
        return '';
    }
  }

  static handleProgressError(error: unknown): void {
    const notificationStore = useNotificationStore();
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    notificationStore.error(errorMessage);
  }
}
