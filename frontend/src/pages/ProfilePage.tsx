import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../lib/axios';
import { useToast } from '../context/ToastContext';
import LoadingScreen from '../components/LoadingScreen';

const bars = ['gryffindor', 'ravenclaw', 'slytherin', 'hufflepuff'];

const ProfilePage = () => {
  const { user, setUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [xpHistory, setXpHistory] = useState<any[]>([]);
  const [breakdown, setBreakdown] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  const fetchProfileData = async () => {
    setError('');
    setLoading(true);
    try {
      const [xpRes, breakdownRes] = await Promise.all([
        axiosInstance.get('/stats/xp-history'),
        axiosInstance.get('/stats/house-breakdown')
      ]);
      setXpHistory(xpRes.data.data || []);
      setBreakdown(breakdownRes.data.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Unable to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleSave = async () => {
    try {
      await axiosInstance.patch('/users/me', { username });
      setUser((prev) => (prev ? { ...prev, username } : prev));
      setEditing(false);
      addToast('Username updated', 'success');
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Unable to update username', 'error');
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete your account permanently?');
    if (!confirmed) return;

    try {
      await axiosInstance.delete('/users/me');
      addToast('Account deleted', 'info');
      logout();
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Unable to delete account', 'error');
    }
  };

  if (!user) {
    return <LoadingScreen />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="rounded-[32px] border border-[rgba(212,170,64,0.2)] bg-[rgba(255,255,255,0.03)] p-8 text-center text-[#e8dcc0]">
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-[rgba(212,170,64,0.2)] bg-[rgba(255,255,255,0.03)] p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full" style={{ background: 'rgba(212,170,64,0.12)' }}>
              <span className="text-3xl font-semibold text-[#d4aa40]">{user.username?.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              {editing ? (
                <div className="flex items-center gap-3">
                  <input value={username} onChange={(e) => setUsername(e.target.value)} className="rounded-3xl border border-[rgba(212,170,64,0.15)] bg-[#0d0b07] px-4 py-3 text-[#e8dcc0] outline-none" />
                  <button onClick={handleSave} className="rounded-full border border-[#d4aa40] px-4 py-2 text-sm text-[#d4aa40]">Save</button>
                </div>
              ) : (
                <h1 className="text-3xl font-semibold">{user.username}</h1>
              )}
              <div className="mt-2 text-sm uppercase tracking-[0.18em] text-[#d4aa40]">{user.house}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setEditing((current) => !current)} className="rounded-full border border-[#d4aa40] px-5 py-3 text-sm text-[#d4aa40]">{editing ? 'Cancel' : 'Edit'}</button>
            <button onClick={handleDelete} className="rounded-full border border-red-500 px-5 py-3 text-sm text-red-300">Delete Account</button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[32px] border border-[rgba(212,170,64,0.2)] bg-[rgba(255,255,255,0.03)] p-6">
          <p className="text-xs uppercase tracking-[0.22em] cinzel text-[#d4aa40]">Stats</p>
          <div className="mt-6 grid gap-4">
            <div className="rounded-3xl bg-[#0f0d09] p-4 text-sm text-[#b9ad84]">Level: {user.level}</div>
            <div className="rounded-3xl bg-[#0f0d09] p-4 text-sm text-[#b9ad84]">Total XP: {user.xp}</div>
            <div className="rounded-3xl bg-[#0f0d09] p-4 text-sm text-[#b9ad84]">HP: {user.hp}</div>
            <div className="rounded-3xl bg-[#0f0d09] p-4 text-sm text-[#b9ad84]">Streak: {user.streak ?? 0}</div>
            <div className="rounded-3xl bg-[#0f0d09] p-4 text-sm text-[#b9ad84]">House Points: {user.housePoints ?? 0}</div>
          </div>
        </div>

        <div className="rounded-[32px] border border-[rgba(212,170,64,0.2)] bg-[rgba(255,255,255,0.03)] p-6 lg:col-span-2">
          <p className="text-xs uppercase tracking-[0.22em] cinzel text-[#d4aa40]">XP History</p>
          <div className="mt-6 grid gap-3">
            <div className="grid grid-cols-4 gap-3 text-xs uppercase tracking-[0.18em] text-[#b9ad84]">
              {xpHistory.slice(-4).map((item) => (
                <span key={item.date}>{item.date}</span>
              ))}
            </div>
            <div className="flex items-end gap-3">
              {xpHistory.map((item) => {
                const height = Math.min(120, Math.max(20, (item.xp / 50) * 20));
                return (
                  <div key={item.date} className="flex-1 text-center">
                    <div className="mx-auto h-[120px] w-full max-w-[40px] rounded-3xl bg-[rgba(212,170,64,0.12)]">
                      <div className="h-full rounded-3xl bg-[#d4aa40]" style={{ height: `${height}px` }} />
                    </div>
                    <div className="mt-2 text-[10px] text-[#b9ad84]">{item.xp}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-[rgba(212,170,64,0.2)] bg-[rgba(255,255,255,0.03)] p-6">
        <p className="text-xs uppercase tracking-[0.22em] cinzel text-[#d4aa40]">House Breakdown</p>
        <div className="mt-6 space-y-4">
          {bars.map((house) => {
            const item = breakdown.find((row) => row.house === house) || { xp: 0, percentage: 0 };
            return (
              <div key={house} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-[#b9ad84]">
                  <span>{house}</span>
                  <span>{item.xp} XP</span>
                </div>
                <div className="h-3 rounded-full bg-[rgba(212,170,64,0.12)]">
                  <div className="h-full rounded-full bg-[#d4aa40]" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
