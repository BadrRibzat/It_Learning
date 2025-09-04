// controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { sendVerificationEmail } from '../utils/email';
import UserProgress from '../models/UserProgress';
import { data } from '../data/flashcards';
import i18next from 'i18next';

const generateToken = (id: string) =>
  jwt.sign({ id }, process.env.SECRET_KEY!, { expiresIn: '30d' });

const initProgressDoc = async (userId: string) => {
  const exists = await UserProgress.findOne({ userId });
  if (exists) return exists;
  const stacks: any = {};
  for (const s of data.stacks) {
    stacks[s.id] = {
      totalCards: s.totalCardCount ?? s.flashcards.length,
      passed: [],
      failed: [],
      lastSubmitted: {},
      reviewQueue: { failedUntil: {}, manualRetryAllowed: true }
    };
  }
  return UserProgress.create({ userId, stacks });
};

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword)
    return res.status(400).json({ message: i18next.t('errors.passwords_do_not_match') });

  const userExists = await User.findOne({ email }) as IUser | null;
  if (userExists)
    return res.status(400).json({ message: i18next.t('errors.user_exists') });

  const user = await User.create({ username, email, password }) as IUser;
  if (!user)
    return res.status(400).json({ message: i18next.t('errors.invalid_user_data') });

  const token = generateToken(user._id.toString());
  const verifyLink = `${process.env.CLIENT_URL}/verify/${token}`;
  const emailSent = await sendVerificationEmail(user.email, verifyLink);
  if (!emailSent)
    return res.status(500).json({ message: i18next.t('errors.failed_verification_email') });

  await initProgressDoc(user._id.toString());

  res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    pendingVerification: true
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email })
    .select('+password') as IUser | null;

  if (!user)
    return res.status(401).json({ message: i18next.t('errors.invalid_credentials') });
  if (!user.isVerified)
    return res.status(401).json({ message: i18next.t('errors.email_not_verified') });

  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    return res.status(401).json({ message: i18next.t('errors.invalid_credentials') });

  const token = generateToken(user._id.toString());
  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    token
  });
};

// controllers/authController.ts
export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { id: string };
    const user = await User.findById(decoded.id) as IUser | null;
    if (!user)
      return res.status(404).json({ message: i18next.t('errors.user_not_found') });

    user.isVerified = true;
    await user.save();

    await initProgressDoc(user._id.toString());

    const freshToken = generateToken(user._id.toString());

    // ✅ Return JSON instead of redirect
    return res.json({
      success: true,
      message: i18next.t('messages.email_verified'),
      token: freshToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(400).json({ message: i18next.t('errors.invalid_token') });
  }
};

export const logoutUser = async (_req: Request, res: Response) => {
  res.json({ message: i18next.t('messages.logged_out') });
};
