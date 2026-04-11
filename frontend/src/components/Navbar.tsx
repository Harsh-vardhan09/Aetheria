import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Quests', path: '/quests' },
  { label: 'Spells', path: '/spells' },
  { label: 'Leaderboard', path: '/leaderboard' }
];

const houseColors: Record<string, string> = {
  gryffindor: '#e04040',
  ravenclaw: '#4a7ac8',
  slytherin: '#3aa860',
  hufflepuff: '#e8c030'
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(212,170,64,0.1)] bg-[#070604]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <button type="button" onClick={() => navigate('/dashboard')} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(212,170,64,0.08)] text-[#d4aa40]">⚡</div>
          <span className="text-lg uppercase tracking-[0.18em] cinzel text-[#d4aa40]">AETHERIA</span>
        </button>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.path}
              className={({ isActive }) =>
                `text-sm uppercase tracking-[0.18em] transition ${
                  isActive ? 'text-[#d4aa40] border-b border-[#d4aa40]' : 'text-[#c4b880] hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-3 text-sm text-[#c4b880]">
                <span className="inline-flex h-3 w-3 rounded-full" style={{ background: houseColors[user.house] || '#d4aa40' }} />
                <span className="text-[#d4aa40]">Lv {user.level}</span>
                <span>{user.username}</span>
              </div>
              <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(255,255,255,0.08)] text-sm font-semibold text-[#d4aa40]">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <button
                type="button"
                onClick={logout}
                className="hidden rounded-full border border-[rgba(212,170,64,0.2)] px-3 py-2 text-xs uppercase tracking-[0.18em] text-[#d4aa40] transition hover:bg-[rgba(212,170,64,0.08)] md:inline-flex"
              >
                Logout
              </button>
            </>
          ) : null}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(212,170,64,0.15)] text-[#d4aa40] md:hidden"
            onClick={() => setOpen((current) => !current)}
          >
            ☰
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-[rgba(212,170,64,0.1)] bg-[#070604] p-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                to={item.path}
                key={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm uppercase tracking-[0.18em] ${
                    isActive ? 'bg-[rgba(212,170,64,0.12)] text-[#d4aa40]' : 'text-[#c4b880] hover:bg-[rgba(255,255,255,0.05)]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/profile"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm uppercase tracking-[0.18em] text-[#c4b880] hover:bg-[rgba(255,255,255,0.05)]"
            >
              Profile
            </NavLink>
            <button
              type="button"
              onClick={logout}
              className="rounded-2xl border border-[rgba(212,170,64,0.15)] px-4 py-3 text-sm uppercase tracking-[0.18em] text-[#d4aa40]"
            >
              Logout
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
