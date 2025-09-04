// controllers/flashcardController.ts
import { Request, Response } from 'express';
import { data } from '../data/flashcards';
import { isAnswerValid } from '../utils/validate';
import i18next from 'i18next';

/**
 * GET /api/flashcards/stacks
 * Returns a lightweight list of all stacks (for sidebar/menu)
 */
export const getStacks = (req: Request, res: Response) => {
  const lite = data.stacks.map(s => ({
    id: s.id,
    name: s.name,
    description: s.description,
    totalCardCount: s.totalCardCount || s.flashcards.length
  }));
  res.json({ 
    stacks: lite, 
    ui: data.ui_translations,
    message: i18next.t('flashcards.loaded')
  });
};

/**
 * GET /api/flashcards/stacks/:stackId
 * Returns the full stack object with flashcards and QA mode
 */
export const getStackCards = (req: Request, res: Response) => {
  const { stackId } = req.params;
  const stack = data.stacks.find(s => s.id === stackId);

  if (!stack) {
    return res.status(404).json({ 
      message: i18next.t('errors.stack_not_found', { stackId }) 
    });
  }

  return res.json(stack);
};

/**
 * POST /api/flashcards/validate
 * Validates a user's answer for a specific flashcard
 */
export const validateAnswer = (req: Request, res: Response) => {
  const { stackId, cardId, input } = req.body as { stackId: string; cardId: string; input: string };

  const stack = data.stacks.find(s => s.id === stackId);
  if (!stack) return res.status(404).json({ message: i18next.t('errors.stack_not_found', { stackId }) });

  const card = stack.flashcards.find(c => c.cardId === cardId);
  if (!card) return res.status(404).json({ message: i18next.t('errors.card_not_found', { cardId }) });

  const ok = isAnswerValid(input, card.valid_answers, card.answer_match);
  res.json({ 
    correct: ok,
    message: ok ? i18next.t('flashcards.correct_answer') : i18next.t('flashcards.incorrect_answer')
  });
};
