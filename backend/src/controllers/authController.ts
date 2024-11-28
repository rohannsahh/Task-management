import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { catchAsync } from '../utils/catchAsync';

const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: '24h'
  });
};

export const register = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  // Create new user
  const user = await User.create({
    email,
    password
  });

  // Generate token
  const token = generateToken(user. id);

  res.status(201).json({
    token,
    user: {
      id: user._id,
      email: user.email
    }
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate token
  const token = generateToken(user._id.toString());

  res.json({
    token,
    user: {
      id: user._id,
      email: user.email
    }
  });
});