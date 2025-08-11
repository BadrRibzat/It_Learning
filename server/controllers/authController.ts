// controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { sendVerificationEmail } from '../utils/email';

interface RegisterRequest extends Request {
  body: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
}

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

interface LogoutRequest extends Request {
  body: {
    token: string;
  };
}

// Generate JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.SECRET_KEY!, {
    expiresIn: '30d'
  });
};

// @desc    Register a user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: RegisterRequest, res: Response) => {
  const { username, email, password, confirmPassword } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password
  });

  if (user) {
    // Generate token
    const token = generateToken(user._id.toString());

    // Send verification email
    const emailSent = await sendVerificationEmail(
      user.email,
      `${process.env.CLIENT_URL}/verify/${token}`
    );

    if (emailSent) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token
      });
    } else {
      res.status(500).json({ message: 'Failed to send verification email' });
    }
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: LoginRequest, res: Response) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email }).select('+password');

  // Check if user exists
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Check if user is verified
  if (!user.isVerified) {
    return res.status(401).json({ message: 'Please verify your email first' });
  }

  // Check password
  const isMatch = await user.comparePassword(password);

  if (isMatch) {
    // Generate token
    const token = generateToken(user._id.toString());

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// @desc    Verify user email
// @route   GET /api/auth/verify/:token
// @access  Public
export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { id: string };
    
    // Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user to verified
    user.isVerified = true;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

export const logoutUser = async (req: LogoutRequest, res: Response) => {
  try {
    // In a more advanced implementation, you would add the token to a blacklist
    // For JWT, the primary logout is client-side by removing the token
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging out' });
  }
};
