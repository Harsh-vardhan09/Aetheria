interface StatChipProps {
  value: string | number;
  label: string;
  color?: string;
}

const StatChip: React.FC<StatChipProps> = ({ value, label, color = '#d4aa40' }) => {
  return (
    <div className="flex flex-col items-start rounded-3xl border bg-[rgba(255,255,255,0.02)] px-4 py-3 min-w-[110px]"
      style={{ border: '0.5px solid rgba(212,170,64,0.12)' }}>
      <span className="text-xl font-semibold" style={{ color }}>{value}</span>
      <span className="text-[11px] uppercase tracking-[0.18em]" style={{ color: '#4a4530' }}>{label}</span>
    </div>
  );
};

export default StatChip;
