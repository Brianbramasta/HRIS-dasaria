import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoginPayrollModalStore } from '@/features/payroll/store/useLoginPayrollModalStore';

/**
 * Component untuk mendeteksi route changes dan trigger modal jika akses payroll
 */
const PayrollModalTrigger: React.FC = () => {
  const location = useLocation();
  const { setCurrentRoute } = useLoginPayrollModalStore();

  useEffect(() => {
    // Update route ke store setiap kali location berubah
    setCurrentRoute(location.pathname);
  }, [location.pathname, setCurrentRoute]);

  return null; // Component ini hanya untuk side effect
};

export default PayrollModalTrigger;
