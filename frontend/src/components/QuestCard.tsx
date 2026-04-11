import { QuestItem } from '../context/QuestContext';

interface QuestCardProps {
  quest: QuestItem;
  onComplete?: (id: string) => void;
  onFail?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const badgeColor: Record<string, string> = {
  daily: '#d4aa40',
  trial: '#4a7ac8',
  exam: '#3aa860'
};

const statusLabel: Record<string, string> = {
  pending: 'Pending',
  completed: 'Completed',
  failed: 'Failed'
};

const QuestCard: React.FC<QuestCardProps> = ({ quest, onComplete, onFail, onDelete, showActions = true }) => {
  const houseColors: Record<string, string> = {
    gryffindor: '#e04040',
    ravenclaw: '#4a7ac8',
    slytherin: '#3aa860',
    hufflepuff: '#e8c030'
  };

  return (
    <div
      className="rounded-3xl border bg-[rgba(255,255,255,0.02)] p-5"
      style={{
        borderLeft: `4px solid ${houseColors[quest.house] || '#d4aa40'}`,
        borderColor: 'rgba(212,170,64,0.12)'
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-semibold" style={{ color: '#e8dcc0' }}>{quest.title}</span>
            <span
              className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em]"
              style={{ background: 'rgba(212,170,64,0.08)', color: badgeColor[quest.type] || '#d4aa40' }}
            >
              {quest.type}
            </span>
          </div>
          <div className="mt-2 text-sm text-[#b9ad84]">
            {quest.dueDate ? `Due ${new Date(quest.dueDate).toLocaleDateString()}` : 'No deadline'}
          </div>
        </div>
        <div className="space-y-2 text-right">
          <div className="rounded-full px-3 py-1 text-[12px] uppercase tracking-[0.18em]" style={{ background: 'rgba(255,255,255,0.05)', color: '#d4aa40' }}>
            {statusLabel[quest.status]}
          </div>
          <div className="text-sm" style={{ color: '#c4b880' }}>
            {quest.xpReward} XP
          </div>
        </div>
      </div>
      {showActions ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {quest.status === 'pending' && onComplete ? (
            <button
              type="button"
              onClick={() => onComplete(quest._id)}
              className="rounded-full border px-4 py-2 text-sm"
              style={{ borderColor: 'rgba(212,170,64,0.2)', color: '#d4aa40' }}
            >
              Complete
            </button>
          ) : null}
          {quest.status === 'pending' && onFail ? (
            <button
              type="button"
              onClick={() => onFail(quest._id)}
              className="rounded-full border px-4 py-2 text-sm"
              style={{ borderColor: 'rgba(255,0,0,0.16)', color: '#e66b6b' }}
            >
              Fail
            </button>
          ) : null}
          {onDelete ? (
            <button
              type="button"
              onClick={() => onDelete(quest._id)}
              className="rounded-full border px-4 py-2 text-sm"
              style={{ borderColor: 'rgba(212,170,64,0.12)', color: '#c4b880' }}
            >
              Delete
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default QuestCard;
