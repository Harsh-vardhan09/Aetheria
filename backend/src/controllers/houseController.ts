import { Request, Response } from 'express';
import User from '../models/User';
import { HouseData } from '../types';

const houses: Record<string, HouseData> = {
  gryffindor: {
    name: 'Gryffindor',
    color: '#740001',
    accentColor: '#FFD700',
    tagline: 'Brave at heart',
    description: 'Where dwell the brave at heart, their daring, nerve, and chivalry set Gryffindors apart.',
    traits: ['Bravery', 'Courage', 'Daring', 'Nerve', 'Chivalry']
  },
  ravenclaw: {
    name: 'Ravenclaw',
    color: '#0E1A40',
    accentColor: '#946B2D',
    tagline: 'Wit beyond measure',
    description: 'Or yet in wise old Ravenclaw, if you\'ve a ready mind, where those of wit and learning, will always find their kind.',
    traits: ['Intelligence', 'Wit', 'Wisdom', 'Creativity', 'Learning']
  },
  slytherin: {
    name: 'Slytherin',
    color: '#1A472A',
    accentColor: '#AAAAAA',
    tagline: 'Pure of heart',
    description: 'You\'ll make your real friends, those cunning folks use any means to achieve their ends.',
    traits: ['Ambition', 'Cunning', 'Leadership', 'Resourcefulness', 'Purity']
  },
  hufflepuff: {
    name: 'Hufflepuff',
    color: '#FFDB00',
    accentColor: '#000000',
    tagline: 'Just and loyal',
    description: 'You might belong in Hufflepuff, where they are just and loyal, those patient Hufflepuffis are true and unafraid of toil.',
    traits: ['Loyalty', 'Patience', 'Hard Work', 'Fairness', 'Kindness']
  }
};

export const getHouses = (req: Request, res: Response) => {
  res.json({ success: true, data: Object.values(houses) });
};

export const getHouse = async (req: Request, res: Response) => {
  const { houseName } = req.params;
  const house = houses[houseName.toLowerCase()];

  if (!house) {
    return res.status(404).json({ success: false, error: 'House not found', code: 404 });
  }

  try {
    const memberCount = await User.countDocuments({ house: houseName.toLowerCase() });
    res.json({ success: true, data: { ...house, memberCount } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error', code: 500 });
  }
};