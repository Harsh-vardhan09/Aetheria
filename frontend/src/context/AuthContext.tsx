import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axios';

export interface AuthUser {
  _id: string;
  id?: string;
  username: string;
  email: string;
  house: string;
  level: number;
  xp: number;
  hp: number;
  streak?: number;
  housePoints?: number;
  lastActive?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, house: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('aetheria_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const initUser = async () => {
    const storedToken = localStorage.getItem('aetheria_token');
    if (!storedToken) {
      setIsAuthenticated(false);
      setIsLoading(false);
      setToken(null);
      setUser(null);
      return;
    }

    try {
      const response = await axiosInstance.get('/auth/me');
      setUser(response.data.data);
      setToken(storedToken);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('aetheria_token');
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data.data;
      localStorage.setItem('aetheria_token', newToken);
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string, house: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/auth/register', { username, email, password, house });
      const { token: newToken, user: userData } = response.data.data;
      localStorage.setItem('aetheria_token', newToken);
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
      navigate('/houses');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('aetheria_token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const refreshUser = async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      setUser(response.data.data);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('aetheria_token');
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated,
      login,
      register,
      logout,
      refreshUser,
      setUser,
    }),
    [user, token, isLoading, isAuthenticated]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
