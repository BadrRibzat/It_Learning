import type { LevelProgress, Lesson } from '@/types/lessons';

export class ProgressTracker {
  static calculateLessonCompletion(lesson: Lesson): number {
    if (!lesson.progress) return 0;
    return (lesson.progress.completed_flashcards / lesson.progress.total_flashcards) * 100;
  }

  static calculateLevelCompletion(progress: LevelProgress): number {
    return (progress.completed_lessons / progress.total_lessons) * 100;
  }

  static getNextMilestone(completedFlashcards: number): number {
    const milestones = [5, 10, 15, 20, 25];
    return milestones.find(m => m > completedFlashcards) || milestones[milestones.length - 1];
  }

  static shouldShowCelebration(
    previousProgress: LevelProgress, 
    currentProgress: LevelProgress
  ): boolean {
    // Celebrate on lesson completion
    if (currentProgress.completed_lessons > previousProgress.completed_lessons) {
      return true;
    }

    // Celebrate on level unlock
    if (currentProgress.next_level_unlocked && !previousProgress.next_level_unlocked) {
      return true;
    }

    return false;
  }

  static formatTimeRemaining(nextAttemptDate: string): string {
    const remaining = new Date(nextAttemptDate).getTime() - Date.now();
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }
}
