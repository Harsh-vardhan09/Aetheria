interface XPBarProps {
  current: number;
  max: number;
  color?: string;
  showLabel?: boolean;
}

const XPBar: React.FC<XPBarProps> = ({ current, max, color = '#d4aa40', showLabel = true }) => {
  const progress = Math.min(100, Math.round((current / max) * 100));

  return (
    <div className="rounded-3xl border bg-[rgba(255,255,255,0.02)] p-4" style={{ border: '0.5px solid rgba(212,170,64,0.12)' }}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-sm uppercase tracking-[0.18em]" style={{ color: '#c4b880' }}>
          XP Progress
        </span>
        {showLabel ? <span className="text-xs uppercase tracking-[0.18em]" style={{ color: '#4a4530' }}>{progress}%</span> : null}
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full" style={{ background: 'rgba(212,170,64,0.12)' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: color }} />
      </div>
      <div className="mt-3 text-sm" style={{ color: '#c4b880' }}>
        {current}/{max} XP to next level
      </div>
    </div>
  );
};

export default XPBar;
