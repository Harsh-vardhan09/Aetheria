import { Response } from 'express';
import Quest from '../models/Quest';
import Spell from '../models/Spell';
import Potion from '../models/Potion';
import { AuthRequest } from '../types';

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Get user quests
    const quests = await Quest.find({ userId }).lean();
    const completedQuests = quests.filter(q => q.status === 'completed');

    // Quests completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const questsCompletedToday = completedQuests.filter(q =>
      q.completedAt && q.completedAt >= today && q.completedAt < tomorrow
    ).length;

    // Quests by house
    const questsByHouse = quests.reduce((acc, quest) => {
      acc[quest.house] = (acc[quest.house] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Active potion
    const activePotion = await Potion.findOne({ userId, usedAt: null }).sort({ craftedAt: -1 }).lean();

    // Active spell
    const activeSpell = await Spell.findOne({ userId, isActive: true }).lean();

    // Total completed
    const totalQuestsCompleted = completedQuests.length;

    res.json({
      success: true,
      data: {
        questsCompletedToday,
        questsByHouse,
        activePotion,
        activeSpell,
        totalQuestsCompleted
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error', code: 500 });
  }
};

export const getXpHistory = async (req: AuthRequest, res: Response) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const xpHistory = await Quest.aggregate([
      { $match: { userId: req.user!.id, status: 'completed', completedAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$completedAt' }
          },
          xp: { $sum: '$xpReward' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({ success: true, data: xpHistory.map(item => ({ date: item._id, xp: item.xp })) });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error', code: 500 });
  }
};

export const getHouseBreakdown = async (req: AuthRequest, res: Response) => {
  try {
    const breakdown = await Quest.aggregate([
      { $match: { userId: req.user!.id, status: 'completed' } },
      {
        $group: {
          _id: '$house',
          xp: { $sum: '$xpReward' },
          questCount: { $sum: 1 }
        }
      }
    ]);

    const totalXp = breakdown.reduce((sum, item) => sum + item.xp, 0);
    const result = breakdown.map(item => ({
      house: item._id,
      xp: item.xp,
      questCount: item.questCount,
      percentage: totalXp > 0 ? Math.round((item.xp / totalXp) * 100) : 0
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error', code: 500 });
  }
};