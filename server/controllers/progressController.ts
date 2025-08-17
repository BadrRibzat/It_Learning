import { Request, Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import UserProgress from '../models/UserProgress';
import { data } from '../data/flashcards';

const ensureUserProgress = async (userId: string) => {
  const exists = await UserProgress.findOne({ userId });
  if (exists) return exists;

  // initialize with totals from dataset
  const stacksState: any = {};
  for (const s of data.stacks) {
    stacksState[s.id] = {
      totalCards: s.totalCardCount ?? s.flashcards.length,
      passed: [],
      failed: [],
      lastSubmitted: {},
      reviewQueue: { failedUntil: {}, manualRetryAllowed: true }
    };
  }
  return UserProgress.create({ userId, stacks: stacksState });
};

export const getChecklist = async (req: Request, res: Response) => {
  const { stackId } = req.params;
  const userId = (req as any).userId;

  try {
    const progressDoc = await UserProgress.findOne({ userId });
    if (!progressDoc) {
      return res.status(404).json({ passed: [] });
    }

    const stackProgress = progressDoc.stacks[stackId] || { passed: [], failed: [] };
    const passed = stackProgress.passed;

    // Assuming you have flashcards data to map IDs
    const stack = data.stacks.find(s => s.id === stackId);
    const total = stack?.flashcards.length || 0;

    // Create boolean array for checklist
    const checklist = Array(total).fill(false);
    stack?.flashcards.forEach((card, index) => {
      if (passed.includes(card.cardId)) {
        checklist[index] = true;
      }
    });

    res.json({ passed: checklist });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProgress = async (req: AuthedRequest, res: Response) => {
  const up = await ensureUserProgress(req.userId!);
  res.json(up);
};

// completed vs total (for the circular ring)
export const getRing = async (req: AuthedRequest, res: Response) => {
  const { stackId } = req.params;
  const up = await ensureUserProgress(req.userId!);
  const s = up.stacks[stackId];
  if (!s) return res.status(404).json({ message: 'Unknown stack' });
  const completed = s.passed.length;
  const total = s.totalCards || 0;
  res.json({ completed, total, label: `${completed} vs ${total}` });
};

// store a submission, update passed/failed, record lastSubmitted
export const submitCard = async (req: AuthedRequest, res: Response) => {
  const { stackId, cardId, correct, answer } = req.body as { stackId: string; cardId: string; correct: boolean; answer: string };
  const up = await ensureUserProgress(req.userId!);
  const s = up.stacks[stackId];
  if (!s) return res.status(404).json({ message: 'Unknown stack' });

  s.lastSubmitted[cardId] = { answer, correct, timestamp: new Date() };

  const inPassed = s.passed.includes(cardId);
  const inFailed = s.failed.includes(cardId);

  if (correct) {
    if (!inPassed) s.passed.push(cardId);
    if (inFailed) s.failed = s.failed.filter(id => id !== cardId);
  } else {
    if (!inFailed) s.failed.push(cardId);
  }

  up.lastActivityAt = new Date();
  await up.save();
  res.json({ stacks: up.stacks[stackId] });
};

export const getFailed = async (req: AuthedRequest, res: Response) => {
  const { stackId } = req.params;
  const up = await ensureUserProgress(req.userId!);
  const s = up.stacks[stackId];
  if (!s) return res.status(404).json({ message: 'Unknown stack' });
  res.json({ failed: s.failed, lastSubmitted: s.lastSubmitted });
};

export const resetProgress = async (req: AuthedRequest, res: Response) => {
  const { stackId } = req.params;
  const up = await ensureUserProgress(req.userId!);
  if (stackId === 'all') {
    for (const key of Object.keys(up.stacks)) {
      up.stacks[key].passed = [];
      up.stacks[key].failed = [];
      up.stacks[key].lastSubmitted = {};
    }
  } else if (up.stacks[stackId]) {
    up.stacks[stackId].passed = [];
    up.stacks[stackId].failed = [];
    up.stacks[stackId].lastSubmitted = {};
  } else {
    return res.status(404).json({ message: 'Unknown stack' });
  }
  up.lastActivityAt = new Date();
  await up.save();
  res.json({ message: 'Progress reset' });
};

