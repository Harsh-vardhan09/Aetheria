import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import Quest from '../models/Quest';
import Spell from '../models/Spell';
import Potion from '../models/Potion';
import { AuthRequest } from '../types';

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

export const updateMe = [
  body('username').optional().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg, code: 400 });
    }

    const { username } = req.body;

    try {
      const user = await User.findByIdAndUpdate(
        req.user!.id,
        { username },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found', code: 404 });
      }

      res.json({ success: true, data: user, message: 'Profile updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Server error', code: 500 });
    }
  }
];

export const deleteMe = async (req: AuthRequest, res: Response) => {
  try {
    await Promise.all([
      User.findByIdAndDelete(req.user!.id),
      Quest.deleteMany({ userId: req.user!.id }),
      Spell.deleteMany({ userId: req.user!.id }),
      Potion.deleteMany({ userId: req.user!.id }),
    ]);

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error', code: 500 });
  }
};