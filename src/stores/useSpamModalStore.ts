import { create } from 'zustand';

interface SpamModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  setOpen: (isOpen: boolean) => void;
}

export const useSpamModalStore = create<SpamModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
  setOpen: (isOpen: boolean) => set({ isOpen }),
}));
