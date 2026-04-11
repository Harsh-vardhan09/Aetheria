import { Response } from 'express';
import User from '../models/User';
import HouseCup from '../models/HouseCup';

export const getHouseCup = async (req: any, res: Response) => {
  try {
    const houseCup = await HouseCup.find({}).sort({ totalPoints: -1 }).lean();
    res.json({ success: true, data: houseCup });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error', code: 500 });
  }
};

export const getWizards = async (req: any, res: Response) => {
  try {
    const wizards = await User.find({})
      .select('username house level xp')
      .sort({ xp: -1 })
      .limit(10)
      .lean();

    const result = wizards.map((wizard, index) => ({
      ...wizard,
      rank: index + 1
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error', code: 500 });
  }
};