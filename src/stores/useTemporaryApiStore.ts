import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TemporaryApiState {
  apiUrl: string;
  apiPrefix: string;
  setApiUrl: (url: string) => void;
  setApiPrefix: (prefix: string) => void;
  resetApiUrl: () => void;
  resetApiPrefix: () => void;
  resetAll: () => void;
}

export const useTemporaryApiStore = create<TemporaryApiState>()(
  persist(
    (set) => ({
      apiUrl: '',
      apiPrefix: '',
      setApiUrl: (url: string) => set({ apiUrl: url }),
      setApiPrefix: (prefix: string) => set({ apiPrefix: prefix }),
      resetApiUrl: () => set({ apiUrl: '' }),
      resetApiPrefix: () => set({ apiPrefix: '' }),
      resetAll: () => set({ apiUrl: '', apiPrefix: '' }),
    }),
    {
      name: 'temporary-api-storage',
    }
  )
);

export default useTemporaryApiStore;
