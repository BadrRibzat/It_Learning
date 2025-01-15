
export interface User {
  id: number;
  username: string;
  email: string;
  level: number;
  points: number;
}

export interface Lesson {
  id: number;
  title: string;
  level: number;
  level_order: number;
  content: string;
  difficulty: string;
}

export interface Flashcard {
  id: number;
  word: string;
  definition: string;
  question: string;
  lesson: number;
}

export interface Quiz {
  id: number;
  title: string;
  lesson: number;
}

export interface QuizQuestion {
  id: number;
  question_text: string;
  correct_answer: string;
  options: string[];
  quiz: number;
}

export interface LevelTest {
  id: number;
  title: string;
  level: number;
}

export interface LevelTestQuestion {
  id: number;
  question_text: string;
  correct_answer: string;
  options: string[];
  level_test: number;
}

export interface ChatbotResponse {
  response_text: string;
}
