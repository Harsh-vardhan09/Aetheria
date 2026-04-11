import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HouseCard from '../components/HouseCard';
import hogwartsBackground from '../assets/hogwarts.png';

const houses = [
  { id: 'gryffindor', name: 'Gryffindor', color: '#e04040', border: '#8a1a1a', glow: 'rgba(178,34,34,0.35)', accent: '#e04040', tagline: 'Courage & Honor', description: 'Bravery-driven tasks and bold quests.' },
  { id: 'ravenclaw', name: 'Ravenclaw', color: '#4a7ac8', border: '#0d2248', glow: 'rgba(26,58,110,0.4)', accent: '#4a7ac8', tagline: 'Wisdom & Curiosity', description: 'Learning goals and idea quests.' },
  { id: 'slytherin', name: 'Slytherin', color: '#3aa860', border: '#0d4022', glow: 'rgba(26,107,58,0.35)', accent: '#3aa860', tagline: 'Strategy & Ambition', description: 'Career wins and sly plans.' },
  { id: 'hufflepuff', name: 'Hufflepuff', color: '#e8c030', border: '#8a6e08', glow: 'rgba(200,164,21,0.3)', accent: '#e8c030', tagline: 'Loyalty & Care', description: 'Consistency and wellness rituals.' }
];

const RegisterPage = () => {
  const { register, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedHouse, setSelectedHouse] = useState('gryffindor');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords must match');
      return;
    }

    try {
      await register(username, email, password, selectedHouse);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Unable to register');
    }
  };

  return (
    <div className="min-h-screen bg-[#070604] text-white flex items-center justify-center px-4 py-10" style={{ backgroundImage: `url('${hogwartsBackground}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-[#070604] opacity-90" />
      <div className="relative z-10 w-full max-w-3xl rounded-[32px] border border-[rgba(212,170,64,0.2)] bg-[rgba(255,255,255,0.03)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold cinzel" style={{ color: '#e8dcc0', letterSpacing: '0.18em' }}>AETHERIA</h1>
          <p className="mt-2 text-sm text-[#b9ad84]">Choose your house and embrace your path.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm uppercase tracking-[0.18em] text-[#d4aa40]">
              Username
              <input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-2 w-full rounded-3xl border bg-[#0d0b07] px-4 py-3 text-white outline-none" />
            </label>
            <label className="block text-sm uppercase tracking-[0.18em] text-[#d4aa40]">
              Email
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-2 w-full rounded-3xl border bg-[#0d0b07] px-4 py-3 text-white outline-none" />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm uppercase tracking-[0.18em] text-[#d4aa40]">
              Password
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-2 w-full rounded-3xl border bg-[#0d0b07] px-4 py-3 text-white outline-none" />
            </label>
            <label className="block text-sm uppercase tracking-[0.18em] text-[#d4aa40]">
              Confirm Password
              <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" className="mt-2 w-full rounded-3xl border bg-[#0d0b07] px-4 py-3 text-white outline-none" />
            </label>
          </div>

          <div>
            <div className="text-sm uppercase tracking-[0.18em] text-[#d4aa40] mb-3">Select your house</div>
            <div className="grid gap-4 sm:grid-cols-4">
              {houses.map((house) => (
                <HouseCard
                  key={house.id}
                  house={house}
                  selected={selectedHouse === house.id}
                  onClick={() => setSelectedHouse(house.id)}
                  size="sm"
                />
              ))}
            </div>
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button type="submit" disabled={isLoading} className="w-full rounded-3xl border border-[#d4aa40] bg-[#12100b] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#d4aa40] transition hover:bg-[#1e1b14] disabled:opacity-60">
            {isLoading ? 'Preparing your wand…' : 'Begin Your Journey'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#b9ad84]">
          Already a wizard?{' '}
          <Link to="/login" className="text-[#d4aa40] hover:text-white">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
