import { create } from 'zustand';

export interface ContractData {
  id: string;
  employeeName: string;
  avatar: string;
  contractDuration: string;
  durationColor: "orange" | "red" | "green"; // orange: bulan, red: minggu, green: normal
}

interface SpamModalState {
  isOpen: boolean;
  displayData: ContractData[];
  selectedEmployees: Set<string>;
  loading: boolean;
  error: string | null;
  hasBeenClosed: boolean; // Track if modal was closed for current page
  currentPage: string; // Track current page
  openModal: () => void;
  closeModal: () => void;
  setOpen: (isOpen: boolean) => void;
  fetchEmployeesNearContractEnd: () => Promise<void>;
  getDurationBgColor: (color: "orange" | "red" | "green") => string;
  getDurationColor: (remainingMonth: number) => "orange" | "red" | "green";
  isEmployeePage: (pathname: string) => boolean;
  handleProcess: (navigate: (path: string) => void) => void;
  resetModalState: () => void; // Reset state when page changes
}

export const useSpamModalStore = create<SpamModalState>((set, get) => ({
  isOpen: false,
  displayData: [],
  selectedEmployees: new Set(),
  loading: false,
  error: null,
  hasBeenClosed: false,
  currentPage: '',
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false, hasBeenClosed: true }),
  setOpen: (isOpen: boolean) => set({ isOpen }),
  resetModalState: () => set({ hasBeenClosed: false, isOpen: false }),

  fetchEmployeesNearContractEnd: async () => {
    set({ loading: true, error: null });
    try {
      // For now, return empty data since employee service is removed
      // TODO: Implement when employee feature is restored
      const mockData: ContractData[] = [];
      
      set({ displayData: mockData });
      
      // Only open modal if it hasn't been closed for current page and there's data
      if (mockData.length > 0 && !get().hasBeenClosed) {
        set({ isOpen: true });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch employees near contract end' });
      console.error('Error fetching employees near contract end:', err);
    } finally {
      set({ loading: false });
    }
  },

  getDurationBgColor: (color: "orange" | "red" | "green") => {
    switch (color) {
      case "orange":
        return "bg-orange-100 text-orange-700";
      case "red":
        return "bg-red-100 text-red-700";
      case "green":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  },

  getDurationColor: (remainingMonth: number): "orange" | "red" | "green" => {
    if (remainingMonth <= 1) {
      return "red";
    } else if (remainingMonth <= 3) {
      return "orange";
    }
    return "green";
  },

  isEmployeePage: (pathname: string) => {
    const employeePages = [
      '/employee-data',
      '/resignation',
      '/organization-history'
    ];
    const excludedPages = [
      '/contract-extension',
      '/employee-data/contract-extension'
    ];
    
    // Exclude contract extension pages
    if (excludedPages.some(page => pathname.startsWith(page))) {
      return false;
    }
    
    return employeePages.some(page => pathname.startsWith(page));
  },

  handleProcess: (navigate: (path: string) => void) => {
    //console.log("Processing selected employees:", Array.from(get().selectedEmployees));
    navigate("/contract-extension");
    get().closeModal();
  },
}));
