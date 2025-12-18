import { create } from 'zustand';
import { User } from '../types/Index';

interface AuthStoreState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (payload: { user: User; accessToken: string; refreshToken?: string }) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  setAuth: ({ user, accessToken, refreshToken }) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    set({ user, accessToken, refreshToken: refreshToken || null, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },
  hydrate: () => {
    const token = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? (JSON.parse(userRaw) as User) : null;
    set({ accessToken: token, refreshToken: refresh, user, isAuthenticated: !!token });
  },
}));