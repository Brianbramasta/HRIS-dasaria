import create from 'zustand';

interface FilterState {
  filters: Record<string, string[]>;
  resetKey: string;
  setResetKey: (key: string) => void;
  setFilterFor: (key: string, value: string[]) => void;
  clearFilterFor: (key: string) => void;
  getFilterFor: (key: string) => string[];
  clearAll: () => void;
  initializeFromLocalStorage: () => void;
}

const parseArray = (str: string | null): string[] | null => {
  if (!str) return null;
  try {
    const v = JSON.parse(str);
    return Array.isArray(v) ? v : null;
  } catch {
    return null;
  }
};

const loadFiltersFromLocalStorage = (): Record<string, string[]> => {
  if (typeof window === 'undefined') return {};
  
  const filters: Record<string, string[]> = {};
  
  // Load all datatable_filters_* keys from localStorage
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key && key.startsWith('datatable_filters_')) {
      const pageKey = key.replace('datatable_filters_', '');
      const filterValue = parseArray(window.localStorage.getItem(key));
      if (filterValue && filterValue.length > 0) {
        // Convert page key to a readable format (e.g., 'tunjangan-tidak-tetap' to 'Tunjangan Tidak Tetap')
        const readableKey = pageKey.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        filters[readableKey] = filterValue;
      }
    }
  }
  
  return filters;
};

export const useFilterStore = create<FilterState>((set, get) => ({
  filters: loadFiltersFromLocalStorage(),
  resetKey: '',
  setResetKey: (key: string) => set({ resetKey: key }),
  setFilterFor: (key: string, value: string[]) => {
    set((s) => ({ filters: { ...s.filters, [key]: value } }));
  },
  clearFilterFor: (key: string) => {
    const next = { ...get().filters };
    delete next[key];
    set({ filters: next });
  },
  getFilterFor: (key: string) => get().filters[key] ?? [],
  clearAll: () => set({ filters: {} }),
  initializeFromLocalStorage: () => {
    set({ filters: loadFiltersFromLocalStorage() });
  },
}));

export const setFilterFor = (key: string, value: string[]) =>
  useFilterStore.getState().setFilterFor(key, value);

export const clearFilterFor = (key: string) =>
  useFilterStore.getState().clearFilterFor(key);

export const getFilterFor = (key: string) =>
  useFilterStore.getState().getFilterFor(key);

export const setResetKey = (key: string) =>
  useFilterStore.getState().setResetKey(key);

export const persistPageFilters = (pageKey: string, terms: string[], columns: string[], isFilterActive: boolean = false) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(`datatable_filters_${pageKey}`, JSON.stringify(terms));
  window.localStorage.setItem(`datatable_cols_${pageKey}`, JSON.stringify(columns));
  window.localStorage.setItem(`datatable_filter_active_${pageKey}`, JSON.stringify(isFilterActive));
};

export const loadPageFilters = (
  pageKey: string
): { terms: string[]; columns: string[] | null; isFilterActive: boolean } => {
  if (typeof window === 'undefined') return { terms: [], columns: null, isFilterActive: false };
  const t = parseArray(window.localStorage.getItem(`datatable_filters_${pageKey}`)) ?? [];
  const c = parseArray(window.localStorage.getItem(`datatable_cols_${pageKey}`));
  const active = window.localStorage.getItem(`datatable_filter_active_${pageKey}`);
  const isFilterActive = active ? JSON.parse(active) : false;
  return { terms: t, columns: c, isFilterActive };
};

export const clearAllFilterPersistence = () => {
  if (typeof window === 'undefined') return;
  const keys: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i) ?? '';
    if (k.startsWith('datatable_filters_') || k.startsWith('datatable_cols_') || k.startsWith('datatable_filter_active_')) keys.push(k);
  }
  keys.forEach((k) => window.localStorage.removeItem(k));
  useFilterStore.getState().clearAll();
};

export default useFilterStore;
