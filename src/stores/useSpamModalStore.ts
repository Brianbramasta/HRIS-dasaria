import { create } from 'zustand';
import { employeeMasterDataService } from '@/features/employee/services/EmployeeMasterData.service';

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
  openModal: () => void;
  closeModal: () => void;
  setOpen: (isOpen: boolean) => void;
  fetchEmployeesNearContractEnd: () => Promise<void>;
  getDurationBgColor: (color: "orange" | "red" | "green") => string;
  getDurationColor: (remainingMonth: number) => "orange" | "red" | "green";
  isEmployeePage: (pathname: string) => boolean;
  handleProcess: (navigate: (path: string) => void) => void;
}

export const useSpamModalStore = create<SpamModalState>((set, get) => ({
  isOpen: false,
  displayData: [],
  selectedEmployees: new Set(),
  loading: false,
  error: null,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
  setOpen: (isOpen: boolean) => set({ isOpen }),

  fetchEmployeesNearContractEnd: async () => {
    set({ loading: true, error: null });
    try {
      const response = await employeeMasterDataService.getEmployeesNearContractEnd();
      if (response?.data) {
        let employees = [];
        
        // Handle different API response structures
        if (Array.isArray(response.data)) {
          employees = response.data;
        } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray((response.data as any).data)) {
          employees = (response.data as any).data;
        }

        const mappedData: ContractData[] = employees.map((item: any, index: number) => ({
          id: `${item.employee_name}-${index}`,
          employeeName: item.employee_name,
          avatar: item.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.employee_name}`,
          contractDuration: `${item.remaining_month} Bulan`,
          durationColor: get().getDurationColor(item.remaining_month),
        }));

        set({ displayData: mappedData });
        
        if (mappedData.length > 0) {
          set({ isOpen: true });
        }
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
      '/contract-extension',
      '/resignation',
      '/organization-history'
    ];
    return employeePages.some(page => pathname.startsWith(page));
  },

  handleProcess: (navigate: (path: string) => void) => {
    console.log("Processing selected employees:", Array.from(get().selectedEmployees));
    navigate("/contract-extension");
    get().closeModal();
  },
}));
