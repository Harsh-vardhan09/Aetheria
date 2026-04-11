import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import HouseCard from '../components/HouseCard';
import LoadingScreen from '../components/LoadingScreen';

const houses = [
  {
    id: 'gryffindor',
    name: 'Gryffindor',
    color: '#e04040',
    border: '#8a1a1a',
    glow: 'rgba(178,34,34,0.35)',
    accent: '#e04040',
    tagline: 'Courage & Honor',
    description: 'Daring tasks that test your bravery.'
  },
  {
    id: 'ravenclaw',
    name: 'Ravenclaw',
    color: '#4a7ac8',
    border: '#0d2248',
    glow: 'rgba(26,58,110,0.4)',
    accent: '#4a7ac8',
    tagline: 'Wisdom & Wit',
    description: 'Learning quests and clever rituals.'
  },
  {
    id: 'slytherin',
    name: 'Slytherin',
    color: '#3aa860',
    border: '#0d4022',
    glow: 'rgba(26,107,58,0.35)',
    accent: '#3aa860',
    tagline: 'Strategy & Ambition',
    description: 'Cunning plans and career victories.'
  },
  {
    id: 'hufflepuff',
    name: 'Hufflepuff',
    color: '#e8c030',
    border: '#8a6e08',
    glow: 'rgba(200,164,21,0.3)',
    accent: '#e8c030',
    tagline: 'Loyalty & Balance',
    description: 'Kindness, health, and steady progress.'
  }
];

const HouseSelectionPage = () => {
  const navigate = useNavigate();
  const { user, refreshUser, logout } = useAuth();
  const [selectedHouse, setSelectedHouse] = useState(user?.house || 'gryffindor');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return <LoadingScreen />;
  }

  const handleConfirm = async () => {
    setError('');
    setIsLoading(true);

    try {
      await axiosInstance.patch('/users/me', { house: selectedHouse });
      await refreshUser();
      navigate('/dashboard');
    } catch (err: any) {
      if (err?.response?.status === 401) {
        logout();
        return;
      }
      setError(err?.response?.data?.error || 'Unable to confirm your house.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl rounded-[32px] border border-[rgba(212,170,64,0.2)] bg-[rgba(255,255,255,0.03)] p-6 text-[#e8dcc0] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
      <div className="mb-8 text-center">
        <p className="text-sm uppercase tracking-[0.22em] cinzel text-[#d4aa40]">THE SORTING CEREMONY</p>
        <h1 className="mt-4 text-4xl font-semibold">Choose your house wisely. It defines your path.</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {houses.map((house) => (
          <HouseCard
            key={house.id}
            house={house}
            selected={selectedHouse === house.id}
            onClick={() => setSelectedHouse(house.id)}
            size="lg"
          />
        ))}
      </div>

      {error ? <p className="mt-6 text-center text-sm text-red-400">{error}</p> : null}

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isLoading}
          className="rounded-full border border-[#d4aa40] bg-[#12100b] px-8 py-3 text-sm uppercase tracking-[0.18em] text-[#d4aa40] transition hover:bg-[#1e1b14] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Confirming...' : 'Confirm My House'}
        </button>
      </div>
    </div>
  );
};

export default HouseSelectionPage;
