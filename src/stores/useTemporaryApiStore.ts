import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TemporaryApiState {
  apiUrl: string;
  setApiUrl: (url: string) => void;
  resetApiUrl: () => void;
}

export const useTemporaryApiStore = create<TemporaryApiState>()(
  persist(
    (set) => ({
      apiUrl: '',
      setApiUrl: (url: string) => set({ apiUrl: url }),
      resetApiUrl: () => set({ apiUrl: '' }),
    }),
    {
      name: 'temporary-api-storage',
    }
  )
);

export default useTemporaryApiStore;
