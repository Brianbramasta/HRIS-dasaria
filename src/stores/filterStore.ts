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

const parseArray = (str: string | null): string[] | null => {
  if (!str) return null;
  try {
    const v = JSON.parse(str);
    return Array.isArray(v) ? v : null;
  } catch {
    return null;
  }
};

export const persistPageFilters = (pageKey: string, terms: string[], columns: string[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(`datatable_filters_${pageKey}`, JSON.stringify(terms));
  window.localStorage.setItem(`datatable_cols_${pageKey}`, JSON.stringify(columns));
};

export const loadPageFilters = (
  pageKey: string
): { terms: string[]; columns: string[] | null } => {
  if (typeof window === 'undefined') return { terms: [], columns: null };
  const t = parseArray(window.localStorage.getItem(`datatable_filters_${pageKey}`)) ?? [];
  const c = parseArray(window.localStorage.getItem(`datatable_cols_${pageKey}`));
  return { terms: t, columns: c };
};

export const clearAllFilterPersistence = () => {
  if (typeof window === 'undefined') return;
  const keys: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i) ?? '';
    if (k.startsWith('datatable_filters_') || k.startsWith('datatable_cols_')) keys.push(k);
  }
  keys.forEach((k) => window.localStorage.removeItem(k));
  useFilterStore.getState().clearAll();
};

export default useFilterStore;
