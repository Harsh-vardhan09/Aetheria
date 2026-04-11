import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import Spell from '../models/Spell';
import User from '../models/User';
import { AuthRequest } from '../types';

export const getSpells = async (req: AuthRequest, res: Response) => {
  const { isActive } = req.query;

  try {
    const filter: any = { userId: req.user!.id };
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const spells = await Spell.find(filter).lean();
    res.json({ success: true, data: spells });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error', code: 500 });
  }
};

export const getActiveSpell = async (req: AuthRequest, res: Response) => {
  try {
    const spell = await Spell.findOne({ userId: req.user!.id, isActive: true }).lean();
    res.json({ success: true, data: spell });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error', code: 500 });
  }
};

export const activateSpell = [
  body('spellType').isIn(['focus_charm', 'grind_spell', 'shield_spell', 'wingardium']).withMessage('Invalid spell type'),
  body('durationMinutes').isInt({ min: 1, max: 180 }).withMessage('Duration must be between 1 and 180 minutes'),
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg, code: 400 });
    }

    const { spellType, durationMinutes } = req.body;

    try {
      // Deactivate any existing active spell
      await Spell.updateMany({ userId: req.user!.id, isActive: true }, { isActive: false });

      // If shield_spell, update user
      if (spellType === 'shield_spell') {
        await User.findByIdAndUpdate(req.user!.id, { shieldActive: false });
      }

      const endsAt = new Date(Date.now() + durationMinutes * 60 * 1000);
      const spell = new Spell({ userId: req.user!.id, spellType, durationMinutes, endsAt });
      await spell.save();

      // If shield_spell, update user
      if (spellType === 'shield_spell') {
        await User.findByIdAndUpdate(req.user!.id, { shieldActive: true });
      }

      res.status(201).json({ success: true, data: spell, message: 'Spell activated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Server error', code: 500 });
    }
  }
];

export const deactivateSpell = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const spell = await Spell.findOneAndUpdate(
      { _id: id, userId: req.user!.id, isActive: true },
      { isActive: false },
      { new: true }
    ).lean();

    if (!spell) {
      return res.status(404).json({ success: false, error: 'Active spell not found', code: 404 });
    }

    // If shield_spell, update user
    if (spell.spellType === 'shield_spell') {
      await User.findByIdAndUpdate(req.user!.id, { shieldActive: false });
    }

    res.json({ success: true, message: 'Spell deactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error', code: 500 });
  }
};