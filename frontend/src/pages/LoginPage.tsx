import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import hogwartsBackground from '../assets/hogwarts.png';

const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Unable to sign in');
    }
  };

  return (
    <div className="min-h-screen bg-[#070604] text-white flex items-center justify-center px-4 py-10" style={{ backgroundImage: `url('${hogwartsBackground}')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 1 }}>
      <div className="absolute inset-0 bg-[#070604] opacity-90" />
      <div className="relative z-10 w-full max-w-md rounded-[32px] border border-[rgba(212,170,64,0.2)] bg-[rgba(255,255,255,0.03)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <div className="text-center mb-8">
          <div className="text-6xl" style={{ color: '#d4aa40' }}>⚡</div>
          <h1 className="mt-4 text-3xl font-semibold cinzel" style={{ color: '#e8dcc0', letterSpacing: '0.18em' }}>AETHERIA</h1>
          <p className="mt-2 text-sm text-[#b9ad84]">Enter the wizarding world and begin your journey.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm uppercase tracking-[0.18em] text-[#d4aa40]">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="mt-2 w-full rounded-3xl border bg-[#0d0b07] px-4 py-3 text-white outline-none"
              placeholder="you@hogwarts.com"
            />
          </div>
          <div>
            <label className="text-sm uppercase tracking-[0.18em] text-[#d4aa40]">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="mt-2 w-full rounded-3xl border bg-[#0d0b07] px-4 py-3 text-white outline-none"
              placeholder="••••••••"
            />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-3xl border border-[#d4aa40] bg-[#12100b] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#d4aa40] transition hover:bg-[#1e1b14] disabled:opacity-60"
            disabled={isLoading}
          >
            {isLoading ? 'Entering...' : 'Enter the Wizarding World'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#b9ad84]">
          New wizard?{' '}
          <Link to="/register" className="text-[#d4aa40] hover:text-white">
            Begin your journey
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
