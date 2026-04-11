import { Response } from 'express';
import Quest from '../models/Quest';
import User from '../models/User';
import { AuthRequest, OwlSuggestions } from '../types';

const suggestions = {
  gryffindor: [
    "Morning run 5km",
    "Cold shower",
    "Public speaking practice"
  ],
  ravenclaw: [
    "Solve 2 DSA problems",
    "Read 20 pages",
    "Watch 1 lecture"
  ],
  slytherin: [
    "Update LinkedIn",
    "Review finances",
    "Send 3 networking messages"
  ],
  hufflepuff: [
    "Sleep by 11pm",
    "10 min meditation",
    "Tidy your workspace"
  ]
};

const quotes = [
  "It is our choices that show what we truly are.",
  "Happiness can be found even in the darkest of times.",
  "It does not do to dwell on dreams and forget to live.",
  "We must all face the choice between what is right and what is easy.",
  "Words are our most inexhaustible source of magic.",
  "To the well-organized mind, death is but the next great adventure.",
  "It takes a great deal of bravery to stand up to your enemies.",
  "Differences of habit and language are nothing at all."
];

export const getSuggestions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, error: 'Unauthenticated', code: 401 });
    }

    const userId = req.user.id;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get quests from last 7 days
    const recentQuests = await Quest.find({
      userId,
      createdAt: { $gte: sevenDaysAgo }
    }).lean();

    // Group by house and count completions
    const houseCompletions = recentQuests.reduce((acc, quest) => {
      if (!acc[quest.house]) {
        acc[quest.house] = { total: 0, completed: 0 };
      }
      acc[quest.house].total += 1;
      if (quest.status === 'completed') {
        acc[quest.house].completed += 1;
      }
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);

    // Find neglected houses (0 completions in last 3 days)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const recentCompletions = recentQuests.filter(q =>
      q.status === 'completed' && q.completedAt && q.completedAt >= threeDaysAgo
    );

    const completedHouses = new Set(recentCompletions.map(q => q.house));
    const neglectedHouses = (Object.keys(houseCompletions) as string[]).filter((house: string) => !(completedHouses as Set<string>).has(house));

    // Generate 3 suggestions for neglected houses
    const questSuggestions = [];
    for (let i = 0; i < 3; i++) {
      const house = neglectedHouses[i % neglectedHouses.length] || 'gryffindor';
      const houseSuggestions = suggestions[house as keyof typeof suggestions];
      const title = houseSuggestions[Math.floor(Math.random() * houseSuggestions.length)];
      questSuggestions.push({
        title,
        house,
        xpReward: 100,
        type: 'daily'
      });
    }

    // Check potion combo availability
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const todayQuests = await Quest.find({
      userId,
      status: 'completed',
      completedAt: { $gte: today, $lte: todayEnd }
    }).lean();

    const hasGryffindor = todayQuests.some(q => q.house === 'gryffindor');
    const hasRavenclaw = todayQuests.some(q => q.house === 'ravenclaw');
    const potionComboAvailable = hasGryffindor && hasRavenclaw;

    // Check streak warning
    const user = await User.findById(userId).select('streak lastActive').lean();
    let streakWarning = false;
    if (user && user.streak > 0) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (!user.lastActive || user.lastActive < yesterday) {
        streakWarning = true;
      }
    }

    // Random quote
    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    const result: OwlSuggestions = {
      neglectedHouses,
      suggestions: questSuggestions,
      potionComboAvailable,
      quote,
      streakWarning
    };

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error', code: 500 });
  }
};