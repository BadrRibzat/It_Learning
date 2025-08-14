import { Request, Response } from 'express';
import { data } from '../data/flashcards';
import { isAnswerValid } from '../utils/validate';

export const getStacks = (req: Request, res: Response) => {
  // Send only light metadata for sidebar lists
  const lite = data.stacks.map(s => ({
    id: s.id,
    name: s.name,
    description: s.description,
    totalCardCount: s.totalCardCount
  }));
  res.json({ stacks: lite, ui: data.ui_translations });
};

export const getStackCards = (req: Request, res: Response) => {
  const { stackId } = req.params;
  const { mode = 'flashcard', offset = '0', limit = '50' } = req.query as any;
  const stack = data.stacks.find(s => s.id === stackId);
  if (!stack) return res.status(404).json({ message: 'Stack not found' });

  if (mode === 'qa') {
    const start = parseInt(offset); const end = start + parseInt(limit);
    return res.json({ items: stack.qa_mode.slice(start, end), total: stack.qa_mode.length });
  }
  const start = parseInt(offset); const end = start + parseInt(limit);
  res.json({ items: stack.flashcards.slice(start, end), total: stack.flashcards.length });
};

export const validateAnswer = (req: Request, res: Response) => {
  const { stackId, cardId, input } = req.body as { stackId: string; cardId: string; input: string };

  const stack = data.stacks.find(s => s.id === stackId);
  if (!stack) return res.status(404).json({ message: 'Stack not found' });

  const card = stack.flashcards.find(c => c.cardId === cardId);
  if (!card) return res.status(404).json({ message: 'Card not found' });

  const ok = isAnswerValid(input, card.valid_answers, card.answer_match);
  res.json({ correct: ok });
};

