import { useEffect, useState } from 'react';
import axiosInstance from '../lib/axios';
import { useToast } from '../context/ToastContext';
import LoadingScreen from '../components/LoadingScreen';

const spells = [
  { name: 'Focus Charm', type: 'focus_charm', description: '1 hour of deep, uninterrupted work', color: '#d4aa40', durations: [25, 60, 90] },
  { name: 'Grind Spell', type: 'grind_spell', description: 'High intensity coding session', color: '#4a7ac8', durations: [60, 90, 120] },
  { name: 'Shield Spell', type: 'shield_spell', description: 'Block social media. Ward off distractions.', color: '#3aa860', durations: [60, 120, 180] },
  { name: 'Wingardium', type: 'wingardium', description: 'Light micro-habit check-ins every 30 min', color: '#e8c030', durations: [30, 60, 90] }
];

const SpellsPage = () => {
  const [activeSpell, setActiveSpell] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDurations, setSelectedDurations] = useState<Record<string, number>>({});
  const { addToast } = useToast();

  const loadSpell = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await axiosInstance.get('/spells/active');
      setActiveSpell(response.data.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Unable to fetch spell data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpell();
  }, []);

  const castSpell = async (spellType: string) => {
    const duration = selectedDurations[spellType] || 60;
    try {
      await axiosInstance.post('/spells/activate', { spellType, durationMinutes: duration });
      addToast(`✦ ${spellType.replace('_', ' ')} activated`, 'success');
      loadSpell();
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Spell failed', 'error');
    }
  };

  const deactivateSpell = async () => {
    if (!activeSpell?._id) return;
    try {
      await axiosInstance.patch(`/spells/${activeSpell._id}/deactivate`);
      addToast('Spell deactivated', 'info');
      loadSpell();
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Unable to deactivate spell', 'error');
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-[rgba(212,170,64,0.2)] bg-[rgba(255,255,255,0.03)] p-8">
        <p className="text-xs uppercase tracking-[0.22em] cinzel text-[#d4aa40]">Spell System</p>
        <h1 className="mt-3 text-3xl font-semibold">Cast your next enchantment</h1>
        {activeSpell ? (
          <div className="mt-6 rounded-3xl border border-[#d4aa40] bg-[rgba(212,170,64,0.08)] p-5 text-[#e8dcc0]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm uppercase tracking-[0.18em] text-[#d4aa40]">Active Spell</div>
                <div className="mt-2 text-xl font-semibold">{activeSpell.spellType.replace('_', ' ')}</div>
                <p className="mt-1 text-sm text-[#b9ad84]">Duration: {activeSpell.durationMinutes} min</p>
              </div>
              <button onClick={deactivateSpell} className="rounded-full border border-[#d4aa40] px-5 py-3 text-sm text-[#d4aa40] hover:bg-[rgba(212,170,64,0.08)]">
                Deactivate
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {error ? <div className="rounded-3xl border border-red-500/20 bg-[#2f0f0f] p-6 text-sm text-red-300">{error}</div> : null}

      <div className="grid gap-5 md:grid-cols-2">
        {spells.map((spell) => {
          const selectedDuration = selectedDurations[spell.type] || spell.durations[0];
          const isActive = activeSpell?.spellType === spell.type;

          return (
            <div key={spell.type} className="rounded-[32px] border border-[rgba(212,170,64,0.2)] bg-[rgba(255,255,255,0.03)] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-[#d4aa40]">{spell.name}</p>
                  <h2 className="mt-3 text-2xl font-semibold" style={{ color: spell.color }}>{spell.description}</h2>
                </div>
                <div className="text-3xl">{spell.name === 'Focus Charm' ? '✦' : spell.name === 'Grind Spell' ? '⚡' : spell.name === 'Shield Spell' ? '◈' : '≋'}</div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {spell.durations.map((duration) => (
                  <button
                    key={duration}
                    type="button"
                    onClick={() => setSelectedDurations((prev) => ({ ...prev, [spell.type]: duration }))}
                    className={`rounded-full border px-4 py-2 text-sm ${selectedDuration === duration ? 'bg-[rgba(212,170,64,0.18)] text-[#d4aa40]' : 'border-[rgba(212,170,64,0.15)] text-[#c4b880] hover:bg-[rgba(255,255,255,0.05)]'}`}
                  >
                    {duration} min
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  disabled={isActive}
                  onClick={() => castSpell(spell.type)}
                  className="rounded-full border border-[#d4aa40] bg-[#12100b] px-5 py-3 text-sm uppercase tracking-[0.18em] text-[#d4aa40] hover:bg-[#1e1b14] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isActive ? 'Active' : 'Cast'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpellsPage;
