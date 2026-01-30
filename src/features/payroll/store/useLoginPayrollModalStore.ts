import { create } from 'zustand';

interface PayrollSession {
  token: string;
  createdAt: number;
}

interface LoginPayrollModalStoreState {
  isOpen: boolean;
  previousRoute: string | null;
  currentRoute: string | null;
  payrollSession: PayrollSession | null;
  openModal: (currentRoute: string) => void;
  closeModal: () => void;
  setCurrentRoute: (route: string) => void;
  setPayrollSession: (session: PayrollSession) => void;
  clearPayrollSession: () => void;
}

/**
 * Store untuk manage LoginPayrollModal
 * Logic:
 * - Modal muncul saat pertama kali akses menu Penggajian (dari menu lain) JIKA belum ada session
 * - Modal tidak muncul saat berpindah dalam submenu Penggajian (jika sudah ada session)
 * - Session otomatis dihapus saat keluar dari menu Penggajian
 * - Modal muncul kembali saat masuk ke menu Penggajian dari menu lain (karena session sudah dihapus)
 */
export const useLoginPayrollModalStore = create<LoginPayrollModalStoreState>(
  (set, get) => ({
    isOpen: false,
    previousRoute: null,
    currentRoute: null,
    payrollSession: null,

    setPayrollSession: (session: PayrollSession) => {
      set({ payrollSession: session });
    },

    clearPayrollSession: () => {
      set({ payrollSession: null });
    },

    openModal: (currentRoute: string) => {
      const state = get();
      // Buka modal hanya jika ini adalah akses pertama ke payroll menu DAN belum ada session
      if (!state.payrollSession && (!state.previousRoute || !isPayrollRoute(state.previousRoute))) {
        set({
          isOpen: true,
          previousRoute: state.currentRoute,
          currentRoute,
        });
      } else {
        // Jika sudah ada session atau masih dalam menu payroll, update route tapi jangan buka modal
        set({
          previousRoute: state.currentRoute,
          currentRoute,
        });
      }
    },

    closeModal: () => {
      set({
        isOpen: false,
        previousRoute: null,
        currentRoute: null,
      });
    },

    setCurrentRoute: (route: string) => {
      const state = get();
      const wasInPayroll = state.currentRoute && isPayrollRoute(state.currentRoute);
      const isNowInPayroll = isPayrollRoute(route);

      if (!wasInPayroll && isNowInPayroll) {
        // Masuk ke menu payroll dari menu lain
        // Cek apakah sudah ada session
        if (!state.payrollSession) {
          // Belum ada session, tampilkan modal
          set({
            isOpen: true,
            previousRoute: state.currentRoute,
            currentRoute: route,
          });
        } else {
          // Sudah ada session, langsung akses tanpa modal
          set({
            isOpen: false,
            previousRoute: state.currentRoute,
            currentRoute: route,
          });
        }
      } else if (wasInPayroll && !isNowInPayroll) {
        // Keluar dari menu payroll - hapus session
        set({
          isOpen: false,
          payrollSession: null,
          previousRoute: state.currentRoute,
          currentRoute: route,
        });
      } else if (isNowInPayroll && wasInPayroll) {
        // Pindah dalam menu payroll - tidak buka modal
        set({
          previousRoute: state.currentRoute,
          currentRoute: route,
        });
      } else {
        // Pindah antar menu non-payroll
        set({
          previousRoute: state.currentRoute,
          currentRoute: route,
        });
      }
    },
  })
);

/**
 * Helper function untuk mengecek apakah route adalah payroll/penggajian
 */
const isPayrollRoute = (route: string): boolean => {
  const payrollPaths = [
    '/payroll-configuration',
    '/payroll-period',
    '/payroll-dashboard',
    '/payroll-period-approval',
    '/salary-distribution',
    '/cash-advance',
  ];

  return payrollPaths.some((path) => route.startsWith(path));
};
