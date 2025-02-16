// Base Types
export interface Level {
  id: string;
  name: string;
  order: number;
  description?: string;
  is_unlocked: boolean;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  level_id: string;
  title: string;
  description: string;
  order: number;
  completed: boolean;
  progress?: {
    completed: boolean;
    points: number;
    total_points: number;
  };
}

export interface Flashcard {
  id: string;
  command: string;
  explanation: string;
  example: string;
  question: string;
  answer: string;
  order: number;
}

export interface Quiz {
  id: string;
  lesson_id: string;
  questions: string[];
  total_questions: number;
  passing_score: number;
}

export interface QuizSubmission {
  answers: string[];
}

export interface QuizSubmissionResponse {
  score: number;
  correct_answers: number;
  total_questions: number;
  passed: boolean;
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
    completed: boolean;
    points: number;
    total_points: number;
  };
  points_earned: number;
}

export interface LevelAccess {
  has_access: boolean;
  requires_test: boolean;
  redirect_url: string | null;
  test_id: string | null;
  error: string | null;
}
