import { useNavigate } from "react-router-dom";
import { useState } from "react";

const houses = [
  {
    id: "gryffindor",
    name: "Gryffindor",
    tagline: "Bold & Physical",
    description: "Gym, Sports, Public Speaking",
    color: "#b22222",
    glow: "rgba(178,34,34,0.35)",
    border: "#8a1a1a",
    accent: "#e04040",
    bg: "from-[#1a0a08] via-[#2e0f0f] to-[#1a0a08]",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <circle cx="32" cy="32" r="30" stroke="#8a1a1a" strokeWidth="1" />
        <path
          d="M32 12L37 24L50 24L40 32L44 44L32 36L20 44L24 32L14 24L27 24Z"
          fill="#6a1010"
          stroke="#c03030"
          strokeWidth="0.8"
        />
        <path d="M32 36L20 44L24 32" fill="#8a1818" />
      </svg>
    ),
    xp: 340,
    quests: 2,
    route: "/dashboard/gryffindor",
  },
  {
    id: "ravenclaw",
    name: "Ravenclaw",
    tagline: "Learning & Coding",
    description: "DSA, Research, Books",
    color: "#1a3a6e",
    glow: "rgba(26,58,110,0.4)",
    border: "#0d2248",
    accent: "#4a7ac8",
    bg: "from-[#060e1a] via-[#0d1e38] to-[#060e1a]",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <circle cx="32" cy="32" r="30" stroke="#1a3a6e" strokeWidth="1" />
        <path
          d="M32 16C24 16 17 22 17 30C17 38 23 43 30 43L32 48L34 43C41 43 47 38 47 30C47 22 40 16 32 16Z"
          fill="#0d2040"
          stroke="#2a5a9e"
          strokeWidth="0.8"
        />
        <circle cx="25" cy="29" r="2.5" fill="#5080c0" />
        <circle cx="39" cy="29" r="2.5" fill="#5080c0" />
        <path d="M27 36C29 38 35 38 37 36" stroke="#5080c0" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
    xp: 520,
    quests: 3,
    route: "/dashboard/ravenclaw",
  },
  {
    id: "slytherin",
    name: "Slytherin",
    tagline: "Strategy & Career",
    description: "LinkedIn, Networking, Finance",
    color: "#1a6b3a",
    glow: "rgba(26,107,58,0.35)",
    border: "#0d4022",
    accent: "#3aa860",
    bg: "from-[#060e08] via-[#0d2414] to-[#060e08]",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <circle cx="32" cy="32" r="30" stroke="#1a6b3a" strokeWidth="1" />
        <path
          d="M32 14C32 14 18 24 18 34C18 42 24 48 32 48C40 48 46 42 46 34C46 24 32 14 32 14Z"
          fill="#0a2810"
          stroke="#2a8040"
          strokeWidth="0.8"
        />
        <path
          d="M32 22C32 22 26 30 26 36C26 40 28 42 32 42C36 42 38 40 38 36C38 30 32 22 32 22Z"
          fill="#1a5828"
          stroke="#3aa860"
          strokeWidth="0.6"
        />
      </svg>
    ),
    xp: 280,
    quests: 2,
    route: "/dashboard/slytherin",
  },
  {
    id: "hufflepuff",
    name: "Hufflepuff",
    tagline: "Consistency & Health",
    description: "Meditation, Sleep, Chores",
    color: "#c8a415",
    glow: "rgba(200,164,21,0.3)",
    border: "#8a6e08",
    accent: "#e8c030",
    bg: "from-[#120e04] via-[#261e06] to-[#120e04]",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <circle cx="32" cy="32" r="30" stroke="#8a6e08" strokeWidth="1" />
        <path
          d="M32 14C26 20 16 22 16 32C16 40 22 46 32 48C42 46 48 40 48 32C48 22 38 20 32 14Z"
          fill="#2a1e04"
          stroke="#c8a415"
          strokeWidth="0.8"
        />
        <circle cx="32" cy="32" r="6" fill="#5a4a08" stroke="#e8c030" strokeWidth="0.6" />
        <circle cx="32" cy="32" r="2.5" fill="#c8a415" />
      </svg>
    ),
    xp: 410,
    quests: 1,
    route: "/dashboard/hufflepuff",
  },
];

const spells = [
  { name: "Focus Charm", sub: "1hr deep work", icon: "✦" },
  { name: "Grind Spell", sub: "Code session", icon: "⚡" },
  { name: "Shield", sub: "Block socials", icon: "◈" },
  { name: "Wingardium", sub: "Micro habits", icon: "≋" },
];

const owlMessages = [
  { dot: "#d4aa40", text: "Slytherin tasks neglected for 3 days", sub: "Career & Finance need attention" },
  { dot: "#3aa860", text: "Combine Gym + Coding for a Focus Potion", sub: "2× XP multiplier available today" },
  { dot: "#4a7ac8", text: '"It is our choices that show what we truly are."', sub: "Complete 1 quest to keep your streak" },
];

const Home = () => {
  const navigate = useNavigate();
  const [hoveredHouse, setHoveredHouse] = useState<string | null>(null);

  return (
    <div
      className="min-h-screen text-white relative overflow-x-hidden"
      style={{
        background: "#070604",
        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
      }}
    >
      {/* Starfield noise texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(1px 1px at 20% 30%, rgba(212,170,64,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 80% 15%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 50% 60%, rgba(212,170,64,0.2) 0%, transparent 100%),
            radial-gradient(1px 1px at 10% 80%, rgba(255,255,255,0.15) 0%, transparent 100%),
            radial-gradient(1px 1px at 90% 75%, rgba(212,170,64,0.3) 0%, transparent 100%)`,
        }}
      />

      {/* Hogwarts background with vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `url('./assets/hogwarts.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          opacity: 0.12,
          filter: "saturate(0.4) sepia(0.6)",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(7,6,4,0) 0%, rgba(7,6,4,0.7) 60%, rgba(7,6,4,0.97) 100%)",
        }}
      />

      {/* Floating candle lights */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="pointer-events-none fixed z-0"
          style={{
            left: `${[8, 18, 72, 85, 92, 5][i]}%`,
            top: `${[20, 60, 15, 45, 80, 90][i]}%`,
            width: 2,
            height: 2,
            borderRadius: "50%",
            background: "#d4aa40",
            boxShadow: "0 0 8px 3px rgba(212,170,64,0.25)",
            animation: `candleFlicker ${1.5 + i * 0.4}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.3}s`,
            opacity: 0.6,
          }}
        />
      ))}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Cinzel:wght@400;500;600&display=swap');
        @keyframes candleFlicker {
          0% { opacity: 0.4; transform: scale(1); }
          100% { opacity: 0.8; transform: scale(1.4); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 0.9; }
        }
        .house-card {
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), border-color 0.25s, box-shadow 0.3s;
        }
        .house-card:hover {
          transform: translateY(-6px) scale(1.025);
        }
        .spell-pill {
          transition: background 0.2s, transform 0.15s;
          cursor: pointer;
        }
        .spell-pill:hover {
          background: rgba(212,170,64,0.12) !important;
          transform: scale(1.03);
        }
        .fade-up { animation: fadeUp 0.6s ease both; }
        .fade-up-1 { animation: fadeUp 0.6s 0.1s ease both; }
        .fade-up-2 { animation: fadeUp 0.6s 0.2s ease both; }
        .fade-up-3 { animation: fadeUp 0.6s 0.3s ease both; }
        .fade-up-4 { animation: fadeUp 0.6s 0.4s ease both; }
        .fade-up-5 { animation: fadeUp 0.6s 0.5s ease both; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .gold-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212,170,64,0.35), transparent);
        }
        .cinzel { font-family: 'Cinzel', serif; }
      `}</style>

      {/* NAVBAR */}
      
      {/* MAIN CONTENT */}
      <main className="relative z-10 px-5 sm:px-8 pb-16">

        {/* HERO GREETING */}
        <div className="pt-10 pb-8 fade-up">
          <p
            className="text-xs tracking-[0.25em] mb-2 cinzel"
            style={{ color: "rgba(212,170,64,0.5)" }}
          >
            GOOD EVENING, WIZARD
          </p>
          <h1
            className="text-3xl sm:text-4xl font-light leading-tight"
            style={{ color: "#e8dcc0", letterSpacing: "0.02em" }}
          >
            Your destiny awaits
          </h1>
          <p className="text-sm mt-2" style={{ color: "#4a4530" }}>
            3 quests active · 5-day streak · House Cup standings open
          </p>
        </div>

        <div className="gold-divider mb-8" />

        {/* STAT CHIPS */}
        <div className="flex gap-3 mb-10 fade-up-1 overflow-x-auto scrollbar-hide pb-1">
          {[
            { val: "5", label: "Day streak" },
            { val: "340", label: "House pts" },
            { val: "72%", label: "HP" },
            { val: "3", label: "Quests" },
            { val: "Lv 7", label: "Rank" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center px-4 py-3 rounded-xl flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "0.5px solid rgba(212,170,64,0.12)",
                minWidth: 72,
              }}
            >
              <span
                className="text-lg font-medium cinzel"
                style={{ color: "#d4aa40" }}
              >
                {s.val}
              </span>
              <span
                className="text-[10px] mt-0.5 tracking-wider"
                style={{ color: "#4a4530" }}
              >
                {s.label.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        {/* SECTION: HOUSES */}
        <p
          className="text-[10px] tracking-[0.2em] mb-4 cinzel fade-up-2"
          style={{ color: "rgba(212,170,64,0.45)" }}
        >
          YOUR HOUSES
        </p>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 mb-10 fade-up-2">
          {houses.map((house) => (
            <div
              key={house.id}
              className="house-card flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer"
              style={{
                minWidth: 200,
                border: `1.5px solid ${hoveredHouse === house.id ? house.accent : house.border}`,
                boxShadow:
                  hoveredHouse === house.id
                    ? `0 8px 32px ${house.glow}, 0 0 0 1px ${house.color}30`
                    : "none",
                background: "#0a0908",
              }}
              onClick={() => navigate(house.route)}
              onMouseEnter={() => setHoveredHouse(house.id)}
              onMouseLeave={() => setHoveredHouse(null)}
            >
              {/* Crest area */}
              <div
                className={`h-[130px] flex items-center justify-center bg-gradient-to-br ${house.bg}`}
                style={{ position: "relative" }}
              >
                <div className="w-16 h-16 opacity-90">{house.icon}</div>
                {/* Glow behind crest */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 60%, ${house.glow} 0%, transparent 65%)`,
                    animation: "glowPulse 3s ease-in-out infinite",
                  }}
                />
              </div>

              {/* Card body */}
              <div
                className="p-4"
                style={{
                  background: "rgba(10,9,8,0.95)",
                  borderTop: `1px solid ${house.border}`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[10px] tracking-widest cinzel"
                    style={{ color: house.accent }}
                  >
                    {house.name.toUpperCase()}
                  </span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{
                      background: `${house.color}20`,
                      color: house.accent,
                      border: `0.5px solid ${house.color}40`,
                    }}
                  >
                    {house.quests} quests
                  </span>
                </div>
                <p
                  className="text-sm font-medium mb-0.5"
                  style={{ color: "#d4c8a8", fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {house.tagline}
                </p>
                <p className="text-xs" style={{ color: "#3a3828" }}>
                  {house.description}
                </p>
                {/* XP bar */}
                <div
                  className="mt-3 rounded-full overflow-hidden"
                  style={{ height: 3, background: "rgba(255,255,255,0.05)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(house.xp / 600) * 100}%`,
                      background: house.accent,
                      opacity: 0.7,
                    }}
                  />
                </div>
                <div
                  className="flex justify-between mt-1 text-[10px]"
                  style={{ color: "#3a3828" }}
                >
                  <span>{house.xp} XP</span>
                  <span>600 cap</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SECTION: SPELLS */}
        <p
          className="text-[10px] tracking-[0.2em] mb-4 cinzel fade-up-3"
          style={{ color: "rgba(212,170,64,0.45)" }}
        >
          CAST A SPELL
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 fade-up-3">
          {spells.map((spell) => (
            <div
              key={spell.name}
              className="spell-pill rounded-xl p-4"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "0.5px solid rgba(212,170,64,0.1)",
              }}
            >
              <span
                className="text-xl block mb-2"
                style={{ color: "#d4aa40", fontFamily: "monospace", fontSize: 18 }}
              >
                {spell.icon}
              </span>
              <p
                className="text-sm font-medium"
                style={{
                  color: "#c4b880",
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                {spell.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#3a3828" }}>
                {spell.sub}
              </p>
            </div>
          ))}
        </div>

        <div className="gold-divider mb-8" />

        {/* SECTION: DAILY OWL */}
        <p
          className="text-[10px] tracking-[0.2em] mb-4 cinzel fade-up-4"
          style={{ color: "rgba(212,170,64,0.45)" }}
        >
          THE DAILY OWL
        </p>

        <div
          className="rounded-2xl overflow-hidden fade-up-4"
          style={{
            background: "rgba(255,255,255,0.015)",
            border: "0.5px solid rgba(212,170,64,0.1)",
          }}
        >
          {owlMessages.map((msg, i) => (
            <div
              key={i}
              className="flex gap-4 px-5 py-4"
              style={{
                borderBottom:
                  i < owlMessages.length - 1
                    ? "0.5px solid rgba(255,255,255,0.04)"
                    : "none",
              }}
            >
              <div className="flex-shrink-0 mt-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: msg.dot,
                    boxShadow: `0 0 6px ${msg.dot}80`,
                    animation: "glowPulse 2.5s ease-in-out infinite",
                    animationDelay: `${i * 0.4}s`,
                  }}
                />
              </div>
              <div>
                <p
                  className="text-sm leading-snug"
                  style={{
                    color: "#c4b880",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: msg.text.startsWith('"') ? "italic" : "normal",
                  }}
                >
                  {msg.text}
                </p>
                <p className="text-xs mt-1" style={{ color: "#3a3828" }}>
                  {msg.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <p
          className="text-center text-xs mt-12 fade-up-5 cinzel"
          style={{ color: "rgba(212,170,64,0.2)", letterSpacing: "0.15em" }}
        >
          WHERE REAL LIFE DISCIPLINE MEETS MAGIC
        </p>
      </main>
    </div>
  );
};

export default Home;