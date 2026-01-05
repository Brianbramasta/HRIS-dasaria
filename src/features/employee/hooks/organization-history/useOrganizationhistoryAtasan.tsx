import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useOrganizationChange,
  type UseOrganizationHistoryOptions as UseOrganizationChangeOptions,
} from './useOrganizationChange';

import {
  type OrganizationChangeItem,
  type CreateOrganizationChangePayload,
  type UpdateOrganizationChangePayload,} from '../../services/OrganizationChangeService';

// Re-export type for UI usage
export type { OrganizationChangeItem };

export interface UseOrganizationHistoryAtasanOptions extends UseOrganizationChangeOptions {}

export function useOrganizationHistoryAtasan(options: UseOrganizationHistoryAtasanOptions = {}) {
  const navigate = useNavigate();
  
  // Use the shared logic hook
  const {
    organizationChanges: data,
    isLoading: loading,
    error,
    total,
    page,
    limit,
    fetchOrganizationChanges,
    createOrganizationChange: createOrgChange,
    updateOrganizationChange: updateOrgChange,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
  } = useOrganizationChange(options);

  // UI States
  const [isEditOrgOpen, setIsEditOrgOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<OrganizationChangeItem | null>(null);

  // Wrappers
  const fetchOrganizationHistory = fetchOrganizationChanges;

  const createOrganizationHistory = useCallback(
    async (employeeId: string, payload: CreateOrganizationChangePayload) => {
      const success = await createOrgChange(employeeId, payload);
      if (success) {
        await fetchOrganizationHistory();
      }
      return success;
    },
    [createOrgChange, fetchOrganizationHistory]
  );

  const updateOrganizationHistory = useCallback(
    async (id: string, payload: UpdateOrganizationChangePayload) => {
      const success = await updateOrgChange(id, payload);
      if (success) {
        await fetchOrganizationHistory();
      }
      return success;
    },
    [updateOrgChange, fetchOrganizationHistory]
  );

  const deleteOrganizationHistory = useCallback(
    async (id: string) => {
       // Placeholder for delete if needed
       console.warn('Delete not implemented', id);
    },
    []
  );

  // Compute rows with status
  const rowsWithStatus = useMemo(
    () => data.map((r) => ({ ...r, statusPerubahan: r.status || 'Draft' })),
    [data]
  );

  // UI Handlers
  const handleAddOrganization = useCallback(() => {
    setSelectedRow(null);
    setIsEditOrgOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsEditOrgOpen(false);
    setSelectedRow(null);
  }, []);

  const handleSubmitModal = useCallback(() => {
    setIsEditOrgOpen(false);
    setSelectedRow(null);
    fetchOrganizationHistory();
  }, [fetchOrganizationHistory]);

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownOpen(!isDropdownOpen);
  }, [isDropdownOpen]);

  const handleDropdownClose = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  const handleNavigateToHR = useCallback(() => {
    setIsDropdownOpen(false);
    navigate('/organization-history');
  }, [navigate]);

  const handleNavigateToAtasan = useCallback(() => {
    setIsDropdownOpen(false);
    navigate('/organization-history/atasan');
  }, [navigate]);

  return {
    // Data states
    data,
    loading,
    // isSubmitting,
    error,
    total,
    page,
    limit,
    rowsWithStatus,
    selectedRow,
    
    // Modal states
    isEditOrgOpen,
    isDropdownOpen,
    setSelectedRow,
    setIsEditOrgOpen,
    
    // API operations
    fetchOrganizationHistory,
    createOrganizationHistory,
    updateOrganizationHistory,
    deleteOrganizationHistory,
    
    // Event handlers
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleAddOrganization,
    handleCloseModal,
    handleSubmitModal,
    handleDropdownToggle,
    handleDropdownClose,
    handleNavigateToHR,
    handleNavigateToAtasan,
  };
}

export default useOrganizationHistoryAtasan;
