import { Schema, model, Document } from 'mongoose';

export interface IStackProgress {
  totalCards: number;                 // snapshot so we can render the ring quickly
  passed: string[];                   // cardIds
  failed: string[];                   // cardIds
  lastSubmitted: Record<string, {     // cardId -> last attempt
    answer: string;
    correct: boolean;
    timestamp: Date;
  }>;
  reviewQueue: {
    failedUntil: Record<string, Date>; // spaced repetition/unlock dates
    manualRetryAllowed: boolean;
  };
}

export interface IUserProgress extends Document {
  userId: string;
  stacks: Record<string, IStackProgress>;
  lastActivityAt: Date;
}

const StackProgressSchema = new Schema<IStackProgress>({
  totalCards: { type: Number, default: 0 },
  passed: { type: [String], default: [] },
  failed: { type: [String], default: [] },
  lastSubmitted: { type: Object, default: {} },
  reviewQueue: {
    failedUntil: { type: Object, default: {} },
    manualRetryAllowed: { type: Boolean, default: true }
  }
}, { _id: false });

const UserProgressSchema = new Schema<IUserProgress>({
  userId: { type: String, index: true, unique: true },
  stacks: { type: Object, default: {} },
  lastActivityAt: { type: Date, default: () => new Date() }
}, { timestamps: true });

export default model<IUserProgress>('UserProgress', UserProgressSchema);


