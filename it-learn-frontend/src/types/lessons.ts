// Base Types
export interface Flashcard {
  id: string;
  command: string;
  explanation: string;
  example: string;
  formatted_example: string;
  question: string;
  answer: string;
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  completed: boolean;
  progress: {
    completed_flashcards: number;
    total_flashcards: number;
    quiz_unlocked: boolean;
  };
}

export interface Question {
  id: string;
  type: 'fill_blank' | 'multiple_choice';
  question: string;
  answer?: string;
  order: number;
}

export interface Quiz {
  id: string;
  lesson_id: string;
  questions: Question[];
  total_questions: number;
  passing_score: number;
}

export interface Level {
  id: string;
  name: string;
  order: number;
  is_unlocked: boolean;
  is_current: boolean;
}

// Request/Response Types
export interface QuizSubmission {
  answers: string[];
}

export interface QuizSubmissionResponse {
  score: number;
  correct_answers: number;
  total_questions: number;
  passed: boolean;
  next_lesson_unlocked: boolean;
  points_earned: number;
}

export interface FlashcardAnswer {
  flashcard_id: string;
  user_answer: string;
  expected_answer: string;
}

export interface FlashcardSubmissionResponse {
  correct: boolean;
  progress: {
    completed_flashcards: number;
    total_flashcards: number;
    quiz_unlocked: boolean;
  };
  points_earned: number;
}

export interface LevelTest {
  id: string;
  level: string;
  questions: Question[];
  total_questions: number;
  passing_score: number;
  attempt_info: {
    can_attempt: boolean;
    attempts_made: number;
    max_attempts: number;
    last_attempt: string | null;
    next_attempt_available: string | null;
    reason?: string;
  };
}

export interface TestSubmission {
  answers: string[];
}

export interface TestSubmissionResponse {
  score: number;
  correct_answers: number;
  total_questions: number;
  passed: boolean;
  next_level_unlocked: boolean;
  required_score: number;
  can_retry: boolean;
  retry_available_at: string | null;
  points_earned: number;
}

export interface LevelProgress {
  current_level: string;
  completed_lessons: number;
  total_lessons: number;
  lessons_progress: Array<{
    completed_flashcards: number;
    total_flashcards: number;
    quiz_unlocked: boolean;
  }>;
  quiz_scores: number[];
  level_test_available: boolean;
  next_level_unlocked: boolean;
  total_points: number;
}

// Additional Types for Frontend
export interface LessonState {
  currentLevel: Level | null;
  levels: Level[];
  currentLesson: Lesson | null;
  lessons: Lesson[];
  currentFlashcard: Flashcard | null;
  flashcards: Flashcard[];
  currentQuiz: Quiz | null;
  levelProgress: LevelProgress | null;
  levelTest: LevelTest | null;
  loading: boolean;
  error: string | null;
}

export type LessonStatus = 'not_started' | 'in_progress' | 'completed';
export type QuizStatus = 'locked' | 'available' | 'completed';
export type LevelStatus = 'locked' | 'in_progress' | 'completed';
