import { useProfileStore } from '@/stores/profile';
import { useLessonsStore } from '@/stores/lessons';
import { useNotificationStore } from '@/stores/notification';
import type { LevelProgress } from '@/types/lessons';

export class ProgressTracker {
  private static notificationStore = useNotificationStore();

  static async updateProgress(type: string, data: any) {
    const profileStore = useProfileStore();
    const lessonsStore = useLessonsStore();

    try {
      switch (type) {
        case 'flashcard':
          if (data.correct) {
            await profileStore.updateLearningStats({
              points_earned: data.points_earned,
              correct_answers: 1,
              total_answers: 1,
              completed_flashcards: data.progress.completed_flashcards,
              total_flashcards: data.progress.total_flashcards
            });

            this.notificationStore.success(`Correct! +${data.points_earned} points earned`);

            if (data.progress.quiz_unlocked) {
              this.notificationStore.info('Quiz unlocked! Complete all flashcards to proceed');
              await profileStore.checkAchievements('flashcard_completion');
            }
          } else {
            this.notificationStore.warning('Not quite right. Try again!');
          }
          break;

        case 'quiz':
          if (data.passed) {
            await profileStore.updateLearningStats({
              points_earned: data.points_earned,
              correct_answers: data.correct_answers,
              total_questions: data.total_questions,
              completed_lessons: data.next_lesson_unlocked ? 1 : 0,
              quiz_score: data.score
            });

            this.notificationStore.success(
              `Quiz completed! Score: ${data.score}% (+${data.points_earned} points)`
            );

            if (data.quiz_completed) {
              await profileStore.checkAchievements('quiz_completion');
            }
            
            if (data.next_lesson_unlocked) {
              this.notificationStore.info('New lesson unlocked!');
              await lessonsStore.completeLesson(data.lesson_id);
            }
          } else {
            this.notificationStore.warning(
              `Quiz not passed. Required score: ${data.required_score}%. Try again!`
            );
          }
          break;

        case 'lesson':
          await profileStore.updateLearningStats({
            points_earned: 50,
            completed_lessons: 1
          });
          
          this.notificationStore.success('Lesson completed! +50 bonus points');
          await profileStore.checkAchievements('lesson_completion');
          break;
      }

      await lessonsStore.fetchLevelProgress(lessonsStore.currentLevel?.id || '');
      await profileStore.fetchProgressCircle();

    } catch (error) {
      this.notificationStore.error(
        'Failed to update progress. Please try again later.'
      );
      throw error;
    }
  }

  static shouldUpdateAchievements(progress: LevelProgress): boolean {
    const milestones = {
      lessons: [5, 10, 25, 50, 100],
      quizScore: [70, 80, 90, 100],
      streak: [3, 7, 14, 30, 365]
    };

    return (
      milestones.lessons.includes(progress.completed_lessons) ||
      milestones.quizScore.includes(Math.max(...progress.quiz_scores)) ||
      progress.next_level_unlocked
    );
  }

  static formatProgressMessage(type: string, data: any): string {
    switch (type) {
      case 'flashcard':
        return `Completed ${data.progress.completed_flashcards}/${data.progress.total_flashcards} flashcards`;
      case 'quiz':
        return `Quiz Score: ${data.score}% (${data.correct_answers}/${data.total_questions} correct)`;
      case 'lesson':
        return `Lesson completed! Total lessons completed: ${data.completed_lessons}`;
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
