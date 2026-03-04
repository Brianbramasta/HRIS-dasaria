import { create } from 'zustand';
import { PayrollPeriodImportApprovalStatusData } from '../types/dto/PayrollPeriodType';

interface PayrollApprovalStore {
  // State
  approvalStatus: PayrollPeriodImportApprovalStatusData | null;
  loading: boolean;
  error: string | null;

  // Actions
  setApprovalStatus: (status: PayrollPeriodImportApprovalStatusData | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearStatus: () => void;

  // Computed states for button disabling
  isImportDisabled: () => boolean;
  isFinalizeDisabled: () => boolean;
  isApprovalDisabled: (approvalType: string) => boolean;
  isDistributionDisabled: () => boolean;
  isSelectionDisabled: () => boolean;
  isAllButtonsDisabled: () => boolean;

  // Helper function to convert string/boolean to boolean
  toBoolean: (value: string | boolean) => boolean;
}

export const usePayrollApprovalStore = create<PayrollApprovalStore>((set, get) => ({
  // Initial state
  approvalStatus: null,
  loading: false,
  error: null,

  // Actions
  setApprovalStatus: (status) => set({ approvalStatus: status }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearStatus: () => set({ approvalStatus: null, error: null }),

  // Helper function to convert string/boolean to boolean
  toBoolean: (value) => {
    if (typeof value === 'boolean') return value;
    return value === 'true';
  },

  // Computed states
  isImportDisabled: () => {
    const status = get().approvalStatus;
    if (!status || !status.statusAll) return false;
    const toBoolean = get().toBoolean;
    return toBoolean(status.statusAll.allowance_imported_at) || toBoolean(status.statusAll.closed) || status.statusAll.status_payroll === 'close';
  },

  isFinalizeDisabled: () => {
    const status = get().approvalStatus;
    if (!status || !status.statusAll) return false;
    const toBoolean = get().toBoolean;
    return toBoolean(status.statusAll.approval_hr) || toBoolean(status.statusAll.closed) || status.statusAll.status_payroll === 'close';
  },

  isApprovalDisabled: (approvalType) => {
    const status = get().approvalStatus;
    if (!status || !status.statusAll) return false;
    
    const toBoolean = get().toBoolean;
    
    // Base conditions - disable if closed or payroll is closed
    if (toBoolean(status.statusAll.closed) || status.statusAll.status_payroll === 'close') return true;
    
    // Specific approval type conditions
    switch (approvalType) {
      case 'Persetujuan oleh Direktur HRGA':
        return toBoolean(status.statusAll.approval_direktur_hr);
      case 'Persetujuan oleh FAT':
        return toBoolean(status.statusAll.approval_direktur_fat);
      case 'Persetujuan oleh BOD':
        return toBoolean(status.statusAll.approval_direktur_bod);
      default:
        return false;
    }
  },

  isDistributionDisabled: () => {
    const status = get().approvalStatus;
    if (!status || !status.statusAll) return false;
    const toBoolean = get().toBoolean;
    return toBoolean(status.statusAll.distribute) || toBoolean(status.statusAll.closed) || status.statusAll.status_payroll === 'close';
  },

  isSelectionDisabled: () => {
    const status = get().approvalStatus;
    if (!status || !status.statusAll) return false;
    const toBoolean = get().toBoolean;
    return toBoolean(status.statusAll.closed) || status.statusAll.status_payroll === 'close';
  },

  isAllButtonsDisabled: () => {
    const status = get().approvalStatus;
    if (!status || !status.statusAll) return false;
    const toBoolean = get().toBoolean;
    return toBoolean(status.statusAll.closed) || status.statusAll.status_payroll === 'close';
  },
}));
