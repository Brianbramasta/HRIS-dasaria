import create from 'zustand';

interface LoadingState {
  pendingCount: number;
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  resetLoading: () => void;
  setLoading: (value: boolean) => void;
}

export const useLoadingStore = create<LoadingState>((set, get) => ({
  pendingCount: 0,
  isLoading: false,
  startLoading: () => {
    const next = get().pendingCount + 1;
    set({ pendingCount: next, isLoading: true });
  },
  stopLoading: () => {
    const next = Math.max(0, get().pendingCount - 1);
    set({ pendingCount: next, isLoading: next > 0 });
  },
  resetLoading: () => set({ pendingCount: 0, isLoading: false }),
  setLoading: (value: boolean) => {
    if (value) {
      const next = Math.max(1, get().pendingCount);
      set({ pendingCount: next, isLoading: true });
    } else {
      set({ pendingCount: 0, isLoading: false });
    }
  },
}));

// convenience wrappers
export const startLoading = () => useLoadingStore.getState().startLoading();
export const stopLoading = () => useLoadingStore.getState().stopLoading();
export const resetLoading = () => useLoadingStore.getState().resetLoading();

export default useLoadingStore;