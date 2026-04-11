import { useEffect, useState } from 'react';
import axiosInstance from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { useQuests } from '../context/QuestContext';
import { useToast } from '../context/ToastContext';
import QuestCard from '../components/QuestCard';
import StatChip from '../components/StatChip';
import XPBar from '../components/XPBar';
import LoadingScreen from '../components/LoadingScreen';

const houseLabel: Record<string, string> = {
  gryffindor: 'Gryffindor',
  ravenclaw: 'Ravenclaw',
  slytherin: 'Slytherin',
  hufflepuff: 'Hufflepuff'
};

const DashboardPage = () => {
  const { user } = useAuth();
  const { quests, completeQuest, createQuest } = useQuests();
  const { addToast } = useToast();
  const [owl, setOwl] = useState<any>(null);
  const [activeSpell, setActiveSpell] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    setError('');
    setIsLoading(true);
    try {
      const [owlRes, spellRes] = await Promise.all([
        axiosInstance.get('/owl/suggestions'),
        axiosInstance.get('/spells/active')
      ]);
      setOwl(owlRes.data.data);
      setActiveSpell(spellRes.data.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Unable to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleComplete = async (id: string) => {
    await completeQuest(id);
    addToast('⚡ +XP gained · Quest banished!', 'success');
    fetchDashboard();
  };

  const handleAddSuggestion = async (suggestion: any) => {
    await createQuest({
      title: suggestion.title,
      house: suggestion.house,
      xpReward: suggestion.xpReward,
      type: suggestion.type
    });
    addToast('✦ Quest added from the Daily Owl', 'info');
    fetchDashboard();
  };

  const questCount = quests.filter((quest) => quest.status === 'pending').length;
  const xpThisLevel = user ? user.xp % 500 : 0;

  if (!user) {
    return <LoadingScreen />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="rounded-[32px] border border-[rgba(212,170,64,0.2)] bg-[rgba(255,255,255,0.03)] p-8 text-center">
        <p className="text-xl">Something went wrong · Try again</p>
        <button onClick={fetchDashboard} className="mt-4 rounded-full border border-[#d4aa40] px-6 py-3 text-sm text-[#d4aa40]">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-[rgba(212,170,64,0.2)] bg-[rgba(255,255,255,0.03)] p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] cinzel text-[#d4aa40]">Good evening, {user.username}</p>
            <h1 className="mt-3 text-4xl font-semibold">Your quest path awaits.</h1>
            <p className="mt-2 text-sm text-[#b9ad84]">{questCount} quests active · {user.streak ?? 0}-day streak</p>
          </div>
          {activeSpell ? (
            <div className="rounded-3xl border border-[#d4aa40] bg-[rgba(212,170,64,0.08)] px-5 py-4 text-sm text-[#e8dcc0]">
              ⚡ {activeSpell.spellType.replace('_', ' ')} active · ends soon
            </div>
          ) : null}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-5">
          <StatChip value={user.streak ?? 0} label="Streak" />
          <StatChip value={user.housePoints ?? 0} label="House Points" />
          <StatChip value={`${user.hp}%`} label="HP" />
          <StatChip value={questCount} label="Quests" />
          <StatChip value={`Lv ${user.level}`} label="Level" />
        </div>
      </section>

      <section className="rounded-[32px] border border-[rgba(212,170,64,0.2)] bg-[rgba(255,255,255,0.03)] p-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] cinzel text-[#d4aa40]">Pending Quests</p>
            <h2 className="mt-2 text-2xl font-semibold">House tasks in motion</h2>
          </div>
        </div>
        {quests.length === 0 ? (
          <div className="rounded-3xl border border-[rgba(212,170,64,0.12)] bg-[#0f0d09] p-8 text-center text-[#b9ad84]">No active quests — the Daily Owl awaits.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {quests.map((quest) => (
              <QuestCard key={quest._id} quest={quest} onComplete={handleComplete} showActions />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[32px] border border-[rgba(212,170,64,0.2)] bg-[rgba(255,255,255,0.03)] p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] cinzel text-[#d4aa40]">The Daily Owl</p>
            <h2 className="mt-2 text-2xl font-semibold">Suggestions from the tower</h2>
          </div>
          <p className="text-sm text-[#b9ad84]">{owl?.quote || 'A quiet owl brings inspired quests.'}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {(owl?.suggestions || []).map((suggestion: any, index: number) => (
            <div key={`${suggestion.title}-${index}`} className="rounded-3xl border border-[rgba(212,170,64,0.12)] bg-[#0f0d09] p-5">
              <div className="text-sm uppercase tracking-[0.18em] text-[#d4aa40]">{houseLabel[suggestion.house] || suggestion.house}</div>
              <p className="mt-3 text-lg font-semibold text-[#e8dcc0]">{suggestion.title}</p>
              <button
                type="button"
                onClick={() => handleAddSuggestion(suggestion)}
                className="mt-5 rounded-full border border-[#d4aa40] px-4 py-2 text-sm text-[#d4aa40] hover:bg-[rgba(212,170,64,0.08)]"
              >
                Add Quest
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-[rgba(212,170,64,0.2)] bg-[rgba(255,255,255,0.03)] p-8">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] cinzel text-[#d4aa40]">Progress</p>
            <h2 className="mt-2 text-2xl font-semibold">XP to next level</h2>
          </div>
          <div className="text-sm text-[#b9ad84]">Level {user.level} · {xpThisLevel}/500 XP</div>
        </div>
        <XPBar current={xpThisLevel} max={500} color="#d4aa40" />
      </section>
    </div>
  );
};

export default DashboardPage;
