import { useProfileStore } from '@/stores/profile';
import { useLessonsStore } from '@/stores/lessons';
import { useNotificationStore } from '@/stores/notification';
import type { LevelProgress } from '@/types/lessons';
import { storeToRefs } from 'pinia';

interface FlashcardData {
  correct: boolean;
  points_earned: number;
  progress: {
    quiz_unlocked: boolean;
    completed_flashcards: number;
    total_flashcards: number;
  };
}

interface QuizData {
  passed: boolean;
  score: number;
  points_earned: number;
  quiz_completed: boolean;
  next_lesson_unlocked: boolean;
  required_score: number;
  correct_answers: number;
  total_questions: number;
}

interface LessonData {
  completed_lessons: number;
}

type ProgressData = FlashcardData | QuizData | LessonData;

export class ProgressTracker {
  private static notificationStore = useNotificationStore();

  static async updateProgress(type: string, data: ProgressData): Promise<void> {
    const profileStore = useProfileStore();
    const lessonsStore = useLessonsStore();
    const { currentLevel } = storeToRefs(lessonsStore);

    try {
      switch (type) {
        case 'flashcard':
          if ((data as FlashcardData).correct) {
            await profileStore.fetchStatistics();
            this.notificationStore.success(
              `Correct! +${(data as FlashcardData).points_earned} points earned`
            );
            if ((data as FlashcardData).progress.quiz_unlocked) {
              this.notificationStore.info('Quiz unlocked! Complete all flashcards to proceed.');
              await profileStore.fetchAchievements();
            }
          } else {
            this.notificationStore.warning('Not quite right. Try again!');
          }
          break;

        case 'quiz':
          if ((data as QuizData).passed) {
            await profileStore.fetchStatistics();
            this.notificationStore.success(
              `Quiz completed! Score: ${(data as QuizData).score}% (+${(data as QuizData).points_earned} points)`
            );
            if ((data as QuizData).quiz_completed) {
              await profileStore.fetchAchievements();
            }
            if ((data as QuizData).next_lesson_unlocked) {
              this.notificationStore.info('New lesson unlocked!');
            }
          } else {
            this.notificationStore.warning(
              `Quiz not passed. Required score: ${(data as QuizData).required_score}%. Try again!`
            );
          }
          break;

        case 'lesson':
          await profileStore.fetchStatistics();
          this.notificationStore.success('Lesson completed! +50 bonus points');
          await profileStore.fetchAchievements();
          break;

        default:
          throw new Error('Invalid progress type');
      }

      await lessonsStore.getLevelProgress(currentLevel.value?.id || '');
      await profileStore.fetchProgressCircle();
    } catch (error: unknown) {
      this.notificationStore.error('Failed to update progress. Please try again later.');
      throw error;
    }
  }

  static shouldUpdateAchievements(progress: LevelProgress): boolean {
    const milestones = {
      lessons: [5, 10, 25, 50, 100],
      quizScore: [70, 80, 90, 100],
      streak: [3, 7, 14, 30, 365],
    };

    return (
      milestones.lessons.includes(progress.completed_lessons) ||
      milestones.quizScore.includes(Math.max(...progress.quiz_scores)) ||
      progress.next_level_unlocked
    );
  }

  static formatProgressMessage(type: string, data: ProgressData): string {
    switch (type) {
      case 'flashcard':
        return `Completed ${(data as FlashcardData).progress.completed_flashcards}/${
          (data as FlashcardData).progress.total_flashcards
        } flashcards`;
      case 'quiz':
        return `Quiz Score: ${(data as QuizData).score}% (${(data as QuizData).correct_answers}/${
          (data as QuizData).total_questions
        } correct)`;
      case 'lesson':
        return `Lesson completed! Total lessons completed: ${(data as LessonData).completed_lessons}`;
      default:
        return '';
    }
  }

  static handleProgressError(error: unknown): void {
    const notificationStore = useNotificationStore();
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred';
    notificationStore.error(errorMessage);
  }
}
