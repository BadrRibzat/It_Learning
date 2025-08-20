// server/data/types.ts
export type Lang = 'en' | 'fr' | 'es' | 'de' | 'ar';

export type MatchRule =
  | { mode: 'exact' | 'normalized'; case_sensitive?: boolean; normalize_whitespace?: boolean }
  | { mode: 'regex'; pattern: string; case_sensitive?: boolean };

export interface Flashcard {
  cardId: string;
  type: 'flashcard';
  difficulty: 'basic' | 'intermediate' | 'advanced';
  tags: string[];
  command: string;
  explanation_translations: Record<Lang, string>;
  question_translations: Record<Lang, string>;
  hints_translations?: Record<Lang, string>;
  example_output?: string;
  valid_answers: string[];
  answer_match: MatchRule;
  createdAt?: string;
  notes_translations?: Record<Lang, string>;
}

export interface QAItem {
  qaId: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  question_translations: Record<Lang, string>;
  explanation_translations?: Record<Lang, string>;
  valid_answers: string[];
  answer_match: MatchRule;
}

export interface Stack {
  id: string;
  name: Record<Lang, string>;
  description: Record<Lang, string>;
  totalCardCount: number;
  flashcards: Flashcard[];
  qa_mode: QAItem[];
}

export interface FlashcardsPayload {
  stacks: Stack[];
  ui_translations: {
    languages_supported: Lang[];
    strings: Record<string, Record<Lang, string>>;
  };
}

