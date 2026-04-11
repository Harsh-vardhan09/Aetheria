import clsx from 'clsx';

interface HouseCardProps {
  house: {
    id: string;
    name: string;
    color: string;
    border: string;
    glow: string;
    accent: string;
    tagline?: string;
    description?: string;
    traits?: string[];
  };
  selected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const HouseCard: React.FC<HouseCardProps> = ({ house, selected, onClick, size = 'md' }) => {
  const base = 'rounded-3xl border bg-[rgba(255,255,255,0.02)] text-left cursor-pointer transition-all duration-300';
  const sizeStyles = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(base, sizeStyles[size], selected ? 'shadow-[0_0_25px_rgba(212,170,64,0.18)]' : '', 'border-[0.5px]')}
      style={{
        borderColor: selected ? house.accent : 'rgba(212,170,64,0.12)',
        boxShadow: selected ? `0 0 28px ${house.glow}` : undefined,
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm uppercase tracking-[0.22em] cinzel" style={{ color: 'rgba(212,170,64,0.55)' }}>
            {house.name}
          </div>
          <h3 className="text-xl font-semibold" style={{ color: house.color }}>{house.tagline || house.name}</h3>
        </div>
        <div className="h-12 w-12 rounded-full" style={{ background: house.border }} />
      </div>
      {house.description ? (
        <p className="mt-3 text-sm" style={{ color: '#c4b880' }}>
          {house.description}
        </p>
      ) : null}
      {house.traits ? (
        <div className="mt-4 grid gap-2 text-sm text-[#b9ad84]">
          {house.traits.map((trait) => (
            <span key={trait} className="inline-flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
              {trait}
            </span>
          ))}
        </div>
      ) : null}
    </button>
  );
};

export default HouseCard;
