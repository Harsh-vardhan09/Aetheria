import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import HouseCup from '../models/HouseCup';
import { AuthRequest } from '../types';

export const register = [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('house').isIn(['gryffindor', 'ravenclaw', 'slytherin', 'hufflepuff']).withMessage('Invalid house'),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg, code: 400 });
    }

    const { username, email, password, house } = req.body;

    try {
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'User already exists', code: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ username, email, password: hashedPassword, house });
      await user.save();

      // Initialize house cup if not exists
      await HouseCup.findOneAndUpdate(
        { house },
        { $setOnInsert: { house, totalPoints: 0 } },
        { upsert: true, new: true }
      );

      const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES_IN } as SignOptions);

      res.status(201).json({
        success: true,
        data: { token, user: { id: user._id, username, email, house, level: user.level, xp: user.xp, hp: user.hp } },
        message: 'User registered successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Server error', code: 500 });
    }
  }
];

export const login = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').exists().withMessage('Password is required'),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg, code: 400 });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(400).json({ success: false, error: 'Invalid credentials', code: 400 });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, error: 'Invalid credentials', code: 400 });
      }

      // Check for streak break
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let darkArtsTriggered = false;
      let darkArtsMessage = '';

      if (user.lastActive && user.lastActive < yesterday && user.streak > 0) {
        user.streak = 0;
        user.hp = Math.max(0, user.hp - 15);
        darkArtsTriggered = true;
        darkArtsMessage = 'The Dementors attacked. Streak lost.';
        await user.save();
      }

      const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES_IN } as SignOptions);

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            house: user.house,
            level: user.level,
            xp: user.xp,
            hp: user.hp,
            streak: user.streak,
            housePoints: user.housePoints
          },
          darkArtsTriggered,
          darkArtsMessage
        },
        message: 'Login successful'
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Server error', code: 500 });
    }
  }
];

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.id).select('-password').lean();
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found', code: 404 });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error', code: 500 });
  }
};