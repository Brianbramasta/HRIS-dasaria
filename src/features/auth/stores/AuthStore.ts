import { create } from 'zustand';
import { User } from '../types/Index';

interface AuthStoreState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  setAuth: (payload: { user: User; accessToken: string; refreshToken?: string; rememberMe?: boolean }) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: !!localStorage.getItem('access_token') || !!sessionStorage.getItem('access_token'),
  rememberMe: false,
  setAuth: ({ user, accessToken, refreshToken, rememberMe = false }) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    
    // Clear both storage types first
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    
    // Store in the appropriate storage
    storage.setItem('user', JSON.stringify(user));
    storage.setItem('access_token', accessToken);
    if (refreshToken) storage.setItem('refresh_token', refreshToken);
    
    set({ user, accessToken, refreshToken: refreshToken || null, isAuthenticated: true, rememberMe });
  },
  logout: () => {
    // Clear both storage types
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, rememberMe: false });
  },
  hydrate: () => {
    // Check localStorage first (persistent sessions)
    let token = localStorage.getItem('access_token');
    let refresh = localStorage.getItem('refresh_token');
    let userRaw = localStorage.getItem('user');
    let rememberMe = true;
    
    // If not found in localStorage, check sessionStorage (temporary sessions)
    if (!token) {
      token = sessionStorage.getItem('access_token');
      refresh = sessionStorage.getItem('refresh_token');
      userRaw = sessionStorage.getItem('user');
      rememberMe = false;
    }
    
    const user = userRaw ? (JSON.parse(userRaw) as User) : null;
    set({ accessToken: token, refreshToken: refresh, user, isAuthenticated: !!token, rememberMe });
  },
}));