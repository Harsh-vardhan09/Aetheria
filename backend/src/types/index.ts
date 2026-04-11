import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: { id: string };
}

export interface User {
  _id: string;
  username: string;
  email: string;
  house: 'gryffindor' | 'ravenclaw' | 'slytherin' | 'hufflepuff';
  level: number;
  xp: number;
  hp: number;
  streak: number;
  housePoints: number;
  lastActive: Date;
  createdAt: Date;
}

export interface Quest {
  _id: string;
  userId: string;
  title: string;
  house: 'gryffindor' | 'ravenclaw' | 'slytherin' | 'hufflepuff';
  xpReward: number;
  status: 'pending' | 'completed' | 'failed';
  type: 'daily' | 'trial' | 'exam';
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
}

export interface Spell {
  _id: string;
  userId: string;
  spellType: 'focus_charm' | 'grind_spell' | 'shield_spell' | 'wingardium';
  activatedAt: Date;
  durationMinutes: number;
  isActive: boolean;
  endsAt: Date;
}

export interface Potion {
  _id: string;
  userId: string;
  potionType: string;
  xpMultiplier: number;
  usedAt?: Date;
  craftedAt: Date;
}

export interface HouseCup {
  _id: string;
  house: 'gryffindor' | 'ravenclaw' | 'slytherin' | 'hufflepuff';
  totalPoints: number;
  updatedAt: Date;
}

export interface HouseData {
  name: string;
  color: string;
  accentColor: string;
  tagline: string;
  description: string;
  traits: string[];
}

export interface OwlSuggestions {
  neglectedHouses: string[];
  suggestions: { title: string; house: string; xpReward: number; type: string }[];
  potionComboAvailable: boolean;
  quote: string;
  streakWarning: boolean;
}