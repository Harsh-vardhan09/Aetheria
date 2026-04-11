import { useEffect, useState } from 'react';
import axiosInstance from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<'house' | 'wizards'>('house');
  const [houseCup, setHouseCup] = useState<any[]>([]);
  const [wizards, setWizards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setError('');
    setLoading(true);
    try {
      const [houseRes, wizardRes] = await Promise.all([
        axiosInstance.get('/leaderboard/house-cup'),
        axiosInstance.get('/leaderboard/wizards')
      ]);
      setHouseCup(houseRes.data.data || []);
      setWizards(wizardRes.data.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Unable to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="rounded-[32px] border border-[rgba(212,170,64,0.2)] bg-[rgba(255,255,255,0.03)] p-8 text-center">
        <p className="text-xl">Something went wrong · Try again</p>
        <button onClick={fetchData} className="mt-4 rounded-full border border-[#d4aa40] px-6 py-3 text-sm text-[#d4aa40]">Retry</button>
      </div>
    );
  }

  const maxPoints = Math.max(1, ...houseCup.map((item) => item.totalPoints));

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-[rgba(212,170,64,0.2)] bg-[rgba(255,255,255,0.03)] p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] cinzel text-[#d4aa40]">Leaderboard</p>
            <h1 className="mt-3 text-3xl font-semibold">House Cup & Wizard ranks</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setMode('house')} className={`rounded-full px-4 py-2 text-sm uppercase tracking-[0.18em] ${mode === 'house' ? 'bg-[#d4aa40] text-[#070604]' : 'border border-[rgba(212,170,64,0.15)] text-[#c4b880]'}`}>
              House Cup
            </button>
            <button onClick={() => setMode('wizards')} className={`rounded-full px-4 py-2 text-sm uppercase tracking-[0.18em] ${mode === 'wizards' ? 'bg-[#d4aa40] text-[#070604]' : 'border border-[rgba(212,170,64,0.15)] text-[#c4b880]'}`}>
              Wizards
            </button>
          </div>
        </div>
      </div>

      {mode === 'house' ? (
        <div className="grid gap-4 md:grid-cols-2">
          {houseCup.map((house, index) => (
            <div key={house.house} className={`rounded-[32px] border border-[rgba(212,170,64,0.2)] bg-[rgba(255,255,255,0.03)] p-6 ${user?.house === house.house ? 'shadow-[0_0_20px_rgba(212,170,64,0.15)]' : ''}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[#d4aa40]">#{index + 1} {house.house}</div>
                  <div className="mt-2 text-2xl font-semibold">{house.totalPoints} pts</div>
                </div>
                <div className="text-sm text-[#c4b880]">{index === 0 ? 'Gold' : index === 1 ? 'Silver' : index === 2 ? 'Bronze' : 'House'}</div>
              </div>
              <div className="mt-4 h-3 rounded-full bg-[rgba(212,170,64,0.12)]">
                <div className="h-full rounded-full bg-[#d4aa40]" style={{ width: `${(house.totalPoints / maxPoints) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {wizards.map((wizard) => (
            <div key={wizard._id} className={`rounded-[32px] border border-[rgba(212,170,64,0.2)] bg-[rgba(255,255,255,0.03)] p-6 ${wizard.house === user?.house ? 'shadow-[0_0_20px_rgba(212,170,64,0.15)]' : ''}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[#d4aa40]">#{wizard.rank} {wizard.username}</div>
                  <div className="mt-2 text-sm text-[#b9ad84]">House: {wizard.house}</div>
                </div>
                <div className="text-sm text-[#c4b880]">Lv {wizard.level}</div>
              </div>
              <div className="mt-4 h-3 rounded-full bg-[rgba(212,170,64,0.12)]">
                <div className="h-full rounded-full bg-[#d4aa40]" style={{ width: `${Math.min(100, (wizard.xp / (wizards[0]?.xp || 1)) * 100)}%` }} />
              </div>
              <div className="mt-2 text-sm text-[#b9ad84]">Total XP: {wizard.xp}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
