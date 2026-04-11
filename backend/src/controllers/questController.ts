import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import Quest from '../models/Quest';
import User from '../models/User';
import Potion from '../models/Potion';
import HouseCup from '../models/HouseCup';
import { AuthRequest } from '../types';

export const getQuests = async (req: AuthRequest, res: Response) => {
  const { status, house, type } = req.query;

  try {
    const filter: any = { userId: req.user!.id };
    if (status) filter.status = status;
    if (house) filter.house = house;
    if (type) filter.type = type;

    const quests = await Quest.find(filter).lean();
    res.json({ success: true, data: quests });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error', code: 500 });
  }
};

export const createQuest = [
  body('title').isLength({ min: 1 }).withMessage('Title is required'),
  body('house').isIn(['gryffindor', 'ravenclaw', 'slytherin', 'hufflepuff']).withMessage('Invalid house'),
  body('xpReward').optional().isInt({ min: 10, max: 500 }).withMessage('XP reward must be between 10 and 500'),
  body('type').isIn(['daily', 'trial', 'exam']).withMessage('Invalid type'),
  body('dueDate').optional().isISO8601().withMessage('Invalid due date'),
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg, code: 400 });
    }

    const { title, house, xpReward = 100, type, dueDate } = req.body;

    try {
      const quest = new Quest({ userId: req.user!.id, title, house, xpReward, type, dueDate });
      await quest.save();

      res.status(201).json({ success: true, data: quest, message: 'Quest created successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Server error', code: 500 });
    }
  }
];

export const getQuest = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const quest = await Quest.findOne({ _id: id, userId: req.user!.id }).lean();
    if (!quest) {
      return res.status(404).json({ success: false, error: 'Quest not found', code: 404 });
    }

    res.json({ success: true, data: quest });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error', code: 500 });
  }
};

export const updateQuest = [
  body('title').optional().isLength({ min: 1 }).withMessage('Title cannot be empty'),
  body('dueDate').optional().isISO8601().withMessage('Invalid due date'),
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg, code: 400 });
    }

    const { id } = req.params;
    const { title, dueDate } = req.body;

    try {
      const quest = await Quest.findOneAndUpdate(
        { _id: id, userId: req.user!.id },
        { title, dueDate },
        { new: true, runValidators: true }
      ).lean();

      if (!quest) {
        return res.status(404).json({ success: false, error: 'Quest not found', code: 404 });
      }

      res.json({ success: true, data: quest, message: 'Quest updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Server error', code: 500 });
    }
  }
];

export const deleteQuest = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const quest = await Quest.findOneAndDelete({ _id: id, userId: req.user!.id });
    if (!quest) {
      return res.status(404).json({ success: false, error: 'Quest not found', code: 404 });
    }

    res.json({ success: true, message: 'Quest deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error', code: 500 });
  }
};

export const completeQuest = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const quest = await Quest.findOne({ _id: id, userId: req.user!.id });
    if (!quest || quest.status !== 'pending') {
      return res.status(404).json({ success: false, error: 'Quest not found or not pending', code: 404 });
    }

    const user = await User.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found', code: 404 });
    }

    // Check for active potion
    const activePotion = await Potion.findOne({ userId: req.user!.id, usedAt: null }).sort({ craftedAt: -1 });
    let xpReward = quest.xpReward;
    if (activePotion) {
      xpReward = Math.floor(xpReward * activePotion.xpMultiplier);
      activePotion.usedAt = new Date();
      await activePotion.save();
    }

    // Update quest
    quest.status = 'completed';
    quest.completedAt = new Date();
    await quest.save();

    // Update user stats
    user.xp += xpReward;
    user.level = Math.floor(user.xp / 500) + 1;
    user.hp = Math.min(100, user.hp + 5);

    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (user.lastActive && user.lastActive >= yesterday) {
      user.streak += 1;
    } else {
      user.streak = 1;
    }
    user.lastActive = today;

    await user.save();

    // Update House Cup
    await HouseCup.findOneAndUpdate(
      { house: user.house },
      { $inc: { totalPoints: xpReward }, $set: { updatedAt: new Date() } },
      { upsert: true }
    );

    // Check potion combo
    const todayStart = new Date(today);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const todayQuests = await Quest.find({
      userId: req.user!.id,
      status: 'completed',
      completedAt: { $gte: todayStart, $lte: todayEnd }
    }).lean();

    const hasGryffindor = todayQuests.some(q => q.house === 'gryffindor');
    const hasRavenclaw = todayQuests.some(q => q.house === 'ravenclaw');

    if (hasGryffindor && hasRavenclaw) {
      const potion = new Potion({ userId: req.user!.id, potionType: 'focus_potion', xpMultiplier: 2.0 });
      await potion.save();
    }

    res.json({
      success: true,
      data: {
        user: {
          xp: user.xp,
          level: user.level,
          hp: user.hp,
          streak: user.streak,
          housePoints: user.housePoints
        }
      },
      message: `Quest completed. +${xpReward} XP awarded.`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error', code: 500 });
  }
};

export const failQuest = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const quest = await Quest.findOne({ _id: id, userId: req.user!.id });
    if (!quest || quest.status !== 'pending') {
      return res.status(404).json({ success: false, error: 'Quest not found or not pending', code: 404 });
    }

    const user = await User.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found', code: 404 });
    }

    quest.status = 'failed';
    await quest.save();

    user.hp = Math.max(0, user.hp - 10);
    await user.save();

    res.json({
      success: true,
      data: { hp: user.hp },
      message: 'Quest failed. Dark Arts attack: -10 HP.'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error', code: 500 });
  }
};