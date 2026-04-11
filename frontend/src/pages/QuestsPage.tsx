import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useQuests } from '../context/QuestContext';
import { useToast } from '../context/ToastContext';
import QuestCard from '../components/QuestCard';
import LoadingScreen from '../components/LoadingScreen';

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Failed', value: 'failed' }
];

const houses = [
  { label: 'All Houses', value: '' },
  { label: 'Gryffindor', value: 'gryffindor' },
  { label: 'Ravenclaw', value: 'ravenclaw' },
  { label: 'Slytherin', value: 'slytherin' },
  { label: 'Hufflepuff', value: 'hufflepuff' }
];

const QuestsPage = () => {
  const { quests, isLoading, error, fetchQuests, createQuest, completeQuest, failQuest, deleteQuest } = useQuests();
  const { addToast } = useToast();
  const [statusFilter, setStatusFilter] = useState('');
  const [houseFilter, setHouseFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newQuest, setNewQuest] = useState<{ title: string; house: 'gryffindor' | 'ravenclaw' | 'slytherin' | 'hufflepuff'; type: 'daily' | 'trial' | 'exam'; xpReward: number; dueDate: string }>({ title: '', house: 'gryffindor', type: 'daily', xpReward: 100, dueDate: '' });

  useEffect(() => {
    fetchQuests({ status: statusFilter, house: houseFilter });
  }, [statusFilter, houseFilter]);

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    await createQuest(newQuest);
    setShowModal(false);
    setNewQuest({ title: '', house: 'gryffindor', type: 'daily', xpReward: 100, dueDate: '' });
    addToast('✦ New quest added', 'success');
  };

  const handleComplete = async (id: string) => {
    await completeQuest(id);
    addToast('⚡ Quest completed', 'success');
  };

  const handleFail = async (id: string) => {
    await failQuest(id);
    addToast('☠ Quest failed', 'error');
  };

  const handleDelete = async (id: string) => {
    await deleteQuest(id);
    addToast('Quest removed', 'info');
  };

  const filteredQuests = useMemo(() => quests, [quests]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-[32px] border border-[rgba(212,170,64,0.2)] bg-[rgba(255,255,255,0.03)] p-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] cinzel text-[#d4aa40]">Your Quests</p>
          <h1 className="mt-3 text-3xl font-semibold">Aetheria quest log</h1>
        </div>
        <button onClick={() => setShowModal(true)} className="rounded-full border border-[#d4aa40] bg-[#12100b] px-5 py-3 text-sm uppercase tracking-[0.18em] text-[#d4aa40] hover:bg-[#1e1b14]">
          Add Quest
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-[32px] border border-[rgba(212,170,64,0.2)] bg-[rgba(255,255,255,0.03)] p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatusFilter(option.value)}
                className={`rounded-full px-4 py-2 text-sm uppercase tracking-[0.18em] ${statusFilter === option.value ? 'bg-[#d4aa40] text-[#070604]' : 'border border-[rgba(212,170,64,0.15)] text-[#c4b880] hover:bg-[rgba(255,255,255,0.05)]'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <select value={houseFilter} onChange={(e) => setHouseFilter(e.target.value)} className="rounded-3xl border border-[rgba(212,170,64,0.15)] bg-[#0d0b07] px-4 py-3 text-sm text-[#e8dcc0]">
            {houses.map((house) => (
              <option key={house.value} value={house.value}>{house.label}</option>
            ))}
          </select>
        </div>

        {error ? <div className="rounded-3xl border border-red-500/20 bg-[#2f0f0f] p-4 text-sm text-red-300">{error}</div> : null}

        {filteredQuests.length === 0 ? (
          <div className="rounded-3xl border border-[rgba(212,170,64,0.12)] bg-[#0f0d09] p-10 text-center text-[#b9ad84]">
            No quests found. The Daily Owl suggests some above.
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredQuests.map((quest) => (
              <QuestCard
                key={quest._id}
                quest={quest}
                onComplete={handleComplete}
                onFail={handleFail}
                onDelete={handleDelete}
                showActions
              />
            ))}
          </div>
        )}
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-[32px] border border-[rgba(212,170,64,0.2)] bg-[#070604] p-8 text-[#e8dcc0]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] cinzel text-[#d4aa40]">Add a new quest</p>
                <h2 className="mt-2 text-2xl font-semibold">Conjure a task</h2>
              </div>
              <button type="button" onClick={() => setShowModal(false)} className="text-[#c4b880] hover:text-white">Close</button>
            </div>
            <form className="space-y-4" onSubmit={handleCreate}>
              <div>
                <label className="text-sm uppercase tracking-[0.18em] text-[#d4aa40]">Title</label>
                <input value={newQuest.title} onChange={(e) => setNewQuest((prev) => ({ ...prev, title: e.target.value }))} className="mt-2 w-full rounded-3xl border border-[rgba(212,170,64,0.15)] bg-[#0d0b07] px-4 py-3 text-[#e8dcc0] outline-none" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm uppercase tracking-[0.18em] text-[#d4aa40]">
                  House
                  <select value={newQuest.house} onChange={(e) => setNewQuest((prev) => ({ ...prev, house: e.target.value as 'gryffindor' | 'ravenclaw' | 'slytherin' | 'hufflepuff' }))} className="mt-2 w-full rounded-3xl border border-[rgba(212,170,64,0.15)] bg-[#0d0b07] px-4 py-3 text-[#e8dcc0] outline-none">
                    <option value="gryffindor">Gryffindor</option>
                    <option value="ravenclaw">Ravenclaw</option>
                    <option value="slytherin">Slytherin</option>
                    <option value="hufflepuff">Hufflepuff</option>
                  </select>
                </label>
                <label className="block text-sm uppercase tracking-[0.18em] text-[#d4aa40]">
                  Type
                  <select value={newQuest.type} onChange={(e) => setNewQuest((prev) => ({ ...prev, type: e.target.value as 'daily' | 'trial' | 'exam' }))} className="mt-2 w-full rounded-3xl border border-[rgba(212,170,64,0.15)] bg-[#0d0b07] px-4 py-3 text-[#e8dcc0] outline-none">
                    <option value="daily">Daily</option>
                    <option value="trial">Trial</option>
                    <option value="exam">Exam</option>
                  </select>
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm uppercase tracking-[0.18em] text-[#d4aa40]">
                  XP Reward
                  <input type="number" min={10} max={500} value={newQuest.xpReward} onChange={(e) => setNewQuest((prev) => ({ ...prev, xpReward: Number(e.target.value) }))} className="mt-2 w-full rounded-3xl border border-[rgba(212,170,64,0.15)] bg-[#0d0b07] px-4 py-3 text-[#e8dcc0] outline-none" />
                </label>
                <label className="block text-sm uppercase tracking-[0.18em] text-[#d4aa40]">
                  Due Date
                  <input type="date" value={newQuest.dueDate} onChange={(e) => setNewQuest((prev) => ({ ...prev, dueDate: e.target.value }))} className="mt-2 w-full rounded-3xl border border-[rgba(212,170,64,0.15)] bg-[#0d0b07] px-4 py-3 text-[#e8dcc0] outline-none" />
                </label>
              </div>
              <button type="submit" className="w-full rounded-full border border-[#d4aa40] bg-[#12100b] px-5 py-3 text-sm uppercase tracking-[0.18em] text-[#d4aa40] hover:bg-[#1e1b14]">Create Quest</button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default QuestsPage;
