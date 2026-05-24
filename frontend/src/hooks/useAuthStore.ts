import { create } from 'zustand';
import api from '../services/api';
import type { User, LoginResponse, RegisterPayload } from '../types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem('retromuse_token'),
  isAuthenticated: !!localStorage.getItem('retromuse_token'),
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
      localStorage.setItem('retromuse_token', data.token);
      set({ user: data.user, token: data.token, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (payload) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post<LoginResponse>('/auth/register', payload);
      localStorage.setItem('retromuse_token', data.token);
      set({ token: data.token, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('retromuse_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('retromuse_token');
    if (!token) return;
    try {
      const { data } = await api.get<User>('/auth/me');
      set({ user: data, isAuthenticated: true });
    } catch {
      localStorage.removeItem('retromuse_token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));
