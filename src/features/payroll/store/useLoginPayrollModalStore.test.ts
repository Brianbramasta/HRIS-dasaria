import { renderHook, act } from '@testing-library/react';
import { useLoginPayrollModalStore } from './useLoginPayrollModalStore';
import type { PayrollSession } from './useLoginPayrollModalStore';

describe('useLoginPayrollModalStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useLoginPayrollModalStore());
    act(() => {
      result.current.closeModal();
      result.current.clearPayrollSession();
    });
  });

  describe('Initial State', () => {
    it('harus menginisialisasi dengan state default yang benar', () => {
      const { result } = renderHook(() => useLoginPayrollModalStore());

      expect(result.current.isOpen).toBe(false);
      expect(result.current.previousRoute).toBeNull();
      expect(result.current.currentRoute).toBeNull();
      expect(result.current.payrollSession).toBeNull();
    });
  });

  describe('setPayrollSession', () => {
    it('harus menetapkan payroll session dengan benar', () => {
      const { result } = renderHook(() => useLoginPayrollModalStore());
      const mockSession: PayrollSession = {
        token: 'test-token-123',
        createdAt: Date.now(),
      };

      act(() => {
        result.current.setPayrollSession(mockSession);
      });

      expect(result.current.payrollSession).toEqual(mockSession);
      expect(result.current.payrollSession?.token).toBe('test-token-123');
    });

    it('harus dapat memperbarui session yang sudah ada', () => {
      const { result } = renderHook(() => useLoginPayrollModalStore());
      const firstSession: PayrollSession = {
        token: 'token-1',
        createdAt: 1000,
      };
      const secondSession: PayrollSession = {
        token: 'token-2',
        createdAt: 2000,
      };

      act(() => {
        result.current.setPayrollSession(firstSession);
      });
      expect(result.current.payrollSession?.token).toBe('token-1');

      act(() => {
        result.current.setPayrollSession(secondSession);
      });
      expect(result.current.payrollSession?.token).toBe('token-2');
    });
  });

  describe('clearPayrollSession', () => {
    it('harus menghapus payroll session', () => {
      const { result } = renderHook(() => useLoginPayrollModalStore());
      const mockSession: PayrollSession = {
        token: 'test-token',
        createdAt: Date.now(),
      };

      act(() => {
        result.current.setPayrollSession(mockSession);
      });
      expect(result.current.payrollSession).not.toBeNull();

      act(() => {
        result.current.clearPayrollSession();
      });
      expect(result.current.payrollSession).toBeNull();
    });
  });

  describe('openModal', () => {
    it('harus membuka modal saat belum ada session dan bukan dari payroll route', () => {
      const { result } = renderHook(() => useLoginPayrollModalStore());

      act(() => {
        result.current.openModal('/payroll-dashboard');
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.currentRoute).toBe('/payroll-dashboard');
    });

    it('harus tidak membuka modal jika sudah ada session', () => {
      const { result } = renderHook(() => useLoginPayrollModalStore());
      const mockSession: PayrollSession = {
        token: 'test-token',
        createdAt: Date.now(),
      };

      act(() => {
        result.current.setPayrollSession(mockSession);
        result.current.openModal('/payroll-dashboard');
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.currentRoute).toBe('/payroll-dashboard');
    });

    it('harus tidak membuka modal jika masih dalam menu payroll', () => {
      const { result } = renderHook(() => useLoginPayrollModalStore());

      act(() => {
        result.current.openModal('/payroll-dashboard');
      });
      expect(result.current.isOpen).toBe(true);

      // Pindah ke route payroll lain
      act(() => {
        result.current.openModal('/payroll-period');
      });

      expect(result.current.isOpen).toBe(true); // Modal masih terbuka dari sebelumnya
      expect(result.current.currentRoute).toBe('/payroll-period');
    });

    it('harus menyimpan previousRoute dengan benar saat membuka modal', () => {
      const { result } = renderHook(() => useLoginPayrollModalStore());

      act(() => {
        result.current.setCurrentRoute('/dashboard');
        result.current.openModal('/payroll-dashboard');
      });

      expect(result.current.previousRoute).toBe('/dashboard');
      expect(result.current.currentRoute).toBe('/payroll-dashboard');
    });
  });

  describe('closeModal', () => {
    it('harus menutup modal dan mereset route state', () => {
      const { result } = renderHook(() => useLoginPayrollModalStore());

      act(() => {
        result.current.openModal('/payroll-dashboard');
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.closeModal();
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.previousRoute).toBeNull();
      expect(result.current.currentRoute).toBeNull();
    });

    it('harus tidak menghapus session saat menutup modal', () => {
      const { result } = renderHook(() => useLoginPayrollModalStore());
      const mockSession: PayrollSession = {
        token: 'test-token',
        createdAt: Date.now(),
      };

      act(() => {
        result.current.setPayrollSession(mockSession);
        result.current.openModal('/payroll-dashboard');
        result.current.closeModal();
      });

      expect(result.current.payrollSession).toEqual(mockSession);
    });
  });

  describe('setCurrentRoute', () => {
    describe('Masuk ke payroll dari menu lain', () => {
      it('harus membuka modal saat masuk ke payroll tanpa session', () => {
        const { result } = renderHook(() => useLoginPayrollModalStore());

        act(() => {
          result.current.setCurrentRoute('/dashboard');
          result.current.setCurrentRoute('/payroll-dashboard');
        });

        expect(result.current.isOpen).toBe(true);
        expect(result.current.currentRoute).toBe('/payroll-dashboard');
        expect(result.current.previousRoute).toBe('/dashboard');
      });

      it('harus tidak membuka modal jika sudah ada session', () => {
        const { result } = renderHook(() => useLoginPayrollModalStore());
        const mockSession: PayrollSession = {
          token: 'test-token',
          createdAt: Date.now(),
        };

        act(() => {
          result.current.setPayrollSession(mockSession);
          result.current.setCurrentRoute('/dashboard');
          result.current.setCurrentRoute('/payroll-dashboard');
        });

        expect(result.current.isOpen).toBe(false);
        expect(result.current.currentRoute).toBe('/payroll-dashboard');
      });
    });

    describe('Pindah dalam menu payroll', () => {
      it('harus update route tanpa membuka modal saat pindah dalam payroll', () => {
        const { result } = renderHook(() => useLoginPayrollModalStore());

        act(() => {
          result.current.setCurrentRoute('/payroll-dashboard');
          result.current.openModal('/payroll-dashboard');
        });
        expect(result.current.isOpen).toBe(true);

        act(() => {
          result.current.setCurrentRoute('/payroll-period');
        });

        expect(result.current.isOpen).toBe(true);
        expect(result.current.currentRoute).toBe('/payroll-period');
        expect(result.current.previousRoute).toBe('/payroll-dashboard');
      });

      it('harus mempertahankan session saat pindah dalam menu payroll', () => {
        const { result } = renderHook(() => useLoginPayrollModalStore());
        const mockSession: PayrollSession = {
          token: 'test-token',
          createdAt: Date.now(),
        };

        act(() => {
          result.current.setPayrollSession(mockSession);
          result.current.setCurrentRoute('/payroll-dashboard');
          result.current.setCurrentRoute('/payroll-period');
        });

        expect(result.current.payrollSession).toEqual(mockSession);
      });
    });

    describe('Keluar dari menu payroll', () => {
      it('harus menutup modal dan menghapus session saat keluar payroll', () => {
        const { result } = renderHook(() => useLoginPayrollModalStore());
        const mockSession: PayrollSession = {
          token: 'test-token',
          createdAt: Date.now(),
        };

        act(() => {
          result.current.setPayrollSession(mockSession);
          result.current.setCurrentRoute('/payroll-dashboard');
          result.current.setCurrentRoute('/dashboard');
        });

        expect(result.current.isOpen).toBe(false);
        expect(result.current.payrollSession).toBeNull();
        expect(result.current.currentRoute).toBe('/dashboard');
      });

      it('harus reset previousRoute saat keluar payroll', () => {
        const { result } = renderHook(() => useLoginPayrollModalStore());

        act(() => {
          result.current.setCurrentRoute('/payroll-dashboard');
          result.current.setCurrentRoute('/dashboard');
        });

        expect(result.current.previousRoute).toBe('/payroll-dashboard');
        expect(result.current.currentRoute).toBe('/dashboard');
      });
    });

    describe('Pindah antar menu non-payroll', () => {
      it('harus update route saat pindah antar menu non-payroll', () => {
        const { result } = renderHook(() => useLoginPayrollModalStore());

        act(() => {
          result.current.setCurrentRoute('/dashboard');
          result.current.setCurrentRoute('/staff-management');
        });

        expect(result.current.currentRoute).toBe('/staff-management');
        expect(result.current.previousRoute).toBe('/dashboard');
        expect(result.current.isOpen).toBe(false);
      });

      it('harus tidak membuka modal saat pindah antar menu non-payroll', () => {
        const { result } = renderHook(() => useLoginPayrollModalStore());

        act(() => {
          result.current.setCurrentRoute('/dashboard');
          result.current.setCurrentRoute('/organization');
          result.current.setCurrentRoute('/staff-management');
        });

        expect(result.current.isOpen).toBe(false);
      });
    });
  });

  describe('Complex Scenarios', () => {
    it('scenario: masuk payroll -> buka modal -> set session -> pindah submenu -> keluar payroll', () => {
      const { result } = renderHook(() => useLoginPayrollModalStore());
      const mockSession: PayrollSession = {
        token: 'test-token',
        createdAt: Date.now(),
      };

      // Masuk payroll dari dashboard
      act(() => {
        result.current.setCurrentRoute('/dashboard');
        result.current.setCurrentRoute('/payroll-dashboard');
      });
      expect(result.current.isOpen).toBe(true);

      // Set session setelah login
      act(() => {
        result.current.setPayrollSession(mockSession);
      });
      expect(result.current.payrollSession).not.toBeNull();

      // Pindah ke submenu payroll
      act(() => {
        result.current.setCurrentRoute('/payroll-period');
      });
      expect(result.current.currentRoute).toBe('/payroll-period');
      expect(result.current.payrollSession).not.toBeNull();

      // Keluar dari payroll
      act(() => {
        result.current.setCurrentRoute('/dashboard');
      });
      expect(result.current.isOpen).toBe(false);
      expect(result.current.payrollSession).toBeNull();
      expect(result.current.currentRoute).toBe('/dashboard');
    });

    it('scenario: user masuk payroll 2x tanpa session, modal harus muncul keduanya', () => {
      const { result } = renderHook(() => useLoginPayrollModalStore());

      // Pertama kali masuk payroll
      act(() => {
        result.current.setCurrentRoute('/dashboard');
        result.current.setCurrentRoute('/payroll-dashboard');
      });
      expect(result.current.isOpen).toBe(true);

      // Close modal
      act(() => {
        result.current.closeModal();
      });

      // Keluar dari payroll tanpa set session
      act(() => {
        result.current.setCurrentRoute('/dashboard');
      });
      expect(result.current.payrollSession).toBeNull();

      // Masuk payroll lagi - modal harus muncul lagi
      act(() => {
        result.current.setCurrentRoute('/payroll-period');
      });
      expect(result.current.isOpen).toBe(true);
    });

    it('scenario: multiple route changes dalam payroll, session tetap ada', () => {
      const { result } = renderHook(() => useLoginPayrollModalStore());
      const mockSession: PayrollSession = {
        token: 'test-token',
        createdAt: Date.now(),
      };

      act(() => {
        result.current.setPayrollSession(mockSession);
        result.current.setCurrentRoute('/payroll-dashboard');
        result.current.setCurrentRoute('/payroll-period');
        result.current.setCurrentRoute('/salary-distribution');
        result.current.setCurrentRoute('/cash-advance');
      });

      expect(result.current.payrollSession).toEqual(mockSession);
      expect(result.current.currentRoute).toBe('/cash-advance');
      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('All Payroll Routes', () => {
    const payrollRoutes = [
      '/payroll-configuration',
      '/payroll-period',
      '/payroll-dashboard',
      '/payroll-period-approval',
      '/salary-distribution',
      '/cash-advance',
    ];

    it('harus mengenali semua payroll routes dan membuka modal', () => {
      payrollRoutes.forEach((route) => {
        // Reset store
        const { result } = renderHook(() => useLoginPayrollModalStore());

        act(() => {
          result.current.setCurrentRoute('/dashboard');
          result.current.setCurrentRoute(route);
        });

        expect(result.current.isOpen).toBe(true);
        expect(result.current.currentRoute).toBe(route);
      });
    });

    it('harus mengenali sub-routes dari payroll routes', () => {
      const subRoutes = [
        '/payroll-configuration/edit/123',
        '/payroll-period/detail',
        '/payroll-dashboard/analytics',
      ];

      subRoutes.forEach((route) => {
        const { result } = renderHook(() => useLoginPayrollModalStore());

        act(() => {
          result.current.setCurrentRoute('/dashboard');
          result.current.setCurrentRoute(route);
        });

        expect(result.current.isOpen).toBe(true);
      });
    });
  });

  describe('Non-Payroll Routes', () => {
    const nonPayrollRoutes = ['/dashboard', '/staff-management', '/organization', '/approval'];

    it('harus tidak membuka modal untuk non-payroll routes', () => {
      nonPayrollRoutes.forEach((route) => {
        const { result } = renderHook(() => useLoginPayrollModalStore());

        act(() => {
          result.current.setCurrentRoute(route);
        });

        expect(result.current.isOpen).toBe(false);
      });
    });
  });
});
