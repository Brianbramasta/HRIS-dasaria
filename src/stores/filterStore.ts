import create from 'zustand';

interface FilterState {
  filters: Record<string, string>;
  setFilterFor: (key: string, value: string) => void;
  clearFilterFor: (key: string) => void;
  getFilterFor: (key: string) => string;
  clearAll: () => void;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  filters: {},
  setFilterFor: (key: string, value: string) => {
    set((s) => ({ filters: { ...s.filters, [key]: value } }));
  },
  clearFilterFor: (key: string) => {
    const next = { ...get().filters };
    delete next[key];
    set({ filters: next });
  },
  getFilterFor: (key: string) => get().filters[key] ?? '',
  clearAll: () => set({ filters: {} }),
}));

export const setFilterFor = (key: string, value: string) =>
  useFilterStore.getState().setFilterFor(key, value);

export const clearFilterFor = (key: string) =>
  useFilterStore.getState().clearFilterFor(key);

export const getFilterFor = (key: string) =>
  useFilterStore.getState().getFilterFor(key);

export default useFilterStore;