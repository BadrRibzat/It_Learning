// controllers/flashcardController.ts
import { Request, Response } from 'express';
import { data } from '../data/flashcards';
import { isAnswerValid } from '../utils/validate';

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
  res.json({ stacks: lite, ui: data.ui_translations });
};

/**
 * GET /api/flashcards/stacks/:stackId
 * Returns the full stack object with flashcards and QA mode
 */
export const getStackCards = (req: Request, res: Response) => {
  const { stackId } = req.params;
  const stack = data.stacks.find(s => s.id === stackId);

  if (!stack) {
    return res.status(404).json({ message: 'Stack not found' });
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
  if (!stack) return res.status(404).json({ message: 'Stack not found' });

  const card = stack.flashcards.find(c => c.cardId === cardId);
  if (!card) return res.status(404).json({ message: 'Card not found' });

  const ok = isAnswerValid(input, card.valid_answers, card.answer_match);
  res.json({ correct: ok });
};
