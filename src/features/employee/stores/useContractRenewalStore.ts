import { create } from 'zustand';

interface ContractRenewalVisibilityState {
  // State
  changeTypeName: string | null;

  // Actions
  setChangeTypeName: (name: string | null) => void;
  resetChangeTypeName: () => void;

  // Computed Selectors
  shouldShowAllComponents: () => boolean;
  shouldShowDetailAndOldContract: () => boolean;
  shouldShowOnlyDetail: () => boolean;
  shouldShowAllDetailFields: () => boolean;
}

export const useContractRenewalStore = create<ContractRenewalVisibilityState>(
  (set, get) => ({
    // Initial State
    changeTypeName: null,

    // Actions
    setChangeTypeName: (name: string | null) => set({ changeTypeName: name }),
    resetChangeTypeName: () => set({ changeTypeName: null }),

    // Computed Selectors
    shouldShowAllComponents: () => {
      const { changeTypeName } = get();
      return changeTypeName === 'Diperpanjang Berubah';
    },

    shouldShowDetailAndOldContract: () => {
      const { changeTypeName } = get();
      return changeTypeName === 'Diperpanjang Tetap';
    },

    shouldShowOnlyDetail: () => {
      const { changeTypeName } = get();
      return (
        changeTypeName !== null &&
        changeTypeName !== 'Diperpanjang Berubah' &&
        changeTypeName !== 'Diperpanjang Tetap'
      );
    },

    shouldShowAllDetailFields: () => {
      const { changeTypeName } = get();
      return (
        changeTypeName === 'Diperpanjang Berubah' ||
        changeTypeName === 'Diperpanjang Tetap'
      );
    },
  })
);
