import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import axiosInstance from '../lib/axios';
import { useAuth } from './AuthContext';

export interface QuestItem {
  _id: string;
  title: string;
  house: string;
  type: 'daily' | 'trial' | 'exam';
  xpReward: number;
  status: 'pending' | 'completed' | 'failed';
  dueDate?: string;
  completedAt?: string;
}

interface QuestContextValue {
  quests: QuestItem[];
  isLoading: boolean;
  error: string | null;
  fetchQuests: (filters?: { status?: string; house?: string; type?: string }) => Promise<void>;
  createQuest: (data: Omit<Partial<QuestItem>, '_id' | 'status'>) => Promise<void>;
  completeQuest: (id: string) => Promise<void>;
  failQuest: (id: string) => Promise<void>;
  deleteQuest: (id: string) => Promise<void>;
}

const QuestContext = createContext<QuestContextValue | undefined>(undefined);

export const QuestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quests, setQuests] = useState<QuestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshUser, isAuthenticated } = useAuth();

  const fetchQuests = useCallback(async (filters?: { status?: string; house?: string; type?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (filters?.status) params.status = filters.status;
      if (filters?.house) params.house = filters.house;
      if (filters?.type) params.type = filters.type;
      const response = await axiosInstance.get('/quests', { params });
      setQuests(response.data.data || []);
    } catch (err) {
      setError((err as any)?.response?.data?.error || 'Unable to load quests');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createQuest = async (data: Omit<Partial<QuestItem>, '_id' | 'status'>) => {
    setIsLoading(true);
    setError(null);
    try {
      await axiosInstance.post('/quests', data);
      await fetchQuests({ status: 'pending' });
    } catch (err) {
      setError((err as any)?.response?.data?.error || 'Unable to create quest');
    } finally {
      setIsLoading(false);
    }
  };

  const completeQuest = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await axiosInstance.post(`/quests/${id}/complete`);
      await refreshUser();
      await fetchQuests({ status: 'pending' });
    } catch (err) {
      setError((err as any)?.response?.data?.error || 'Unable to complete quest');
    } finally {
      setIsLoading(false);
    }
  };

  const failQuest = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await axiosInstance.post(`/quests/${id}/fail`);
      await fetchQuests({ status: 'pending' });
    } catch (err) {
      setError((err as any)?.response?.data?.error || 'Unable to fail quest');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteQuest = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/quests/${id}`);
      setQuests((current) => current.filter((quest) => quest._id !== id));
    } catch (err) {
      setError((err as any)?.response?.data?.error || 'Unable to delete quest');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchQuests({ status: 'pending' });
    }
  }, [isAuthenticated, fetchQuests]);

  return (
    <QuestContext.Provider
      value={{ quests, isLoading, error, fetchQuests, createQuest, completeQuest, failQuest, deleteQuest }}
    >
      {children}
    </QuestContext.Provider>
  );
};

export const useQuests = () => {
  const context = useContext(QuestContext);
  if (!context) {
    throw new Error('useQuests must be used within QuestProvider');
  }
  return context;
};
