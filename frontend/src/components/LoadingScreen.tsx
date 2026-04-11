const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070604] text-white">
      <div className="flex flex-col items-center gap-4 px-6 py-8 rounded-3xl" style={{ border: '1px solid rgba(212,170,64,0.2)', background: 'rgba(12,10,6,0.95)' }}>
        <div className="text-[80px] leading-none" style={{ color: '#d4aa40', animation: 'pulse 1.5s ease-in-out infinite' }}>
          ⚡
        </div>
        <div className="text-2xl font-semibold cinzel" style={{ color: '#e8dcc0' }}>
          AETHERIA
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.08); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
