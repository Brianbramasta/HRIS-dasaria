import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useOrganizationChange,
  type UseOrganizationChangeOptions,
  
} from './useOrganizationChange';
import {type OrganizationChangeItem,
  type CreateOrganizationChangePayload,
  type UpdateOrganizationChangePayload} from '../../services/OrganizationChangeService';

// Re-export type for UI usage
export type { OrganizationChangeItem };

export interface UseOrganizationHistoryOptions extends UseOrganizationChangeOptions {}

export function useOrganizationHistory(options: UseOrganizationHistoryOptions = {}) {
  const navigate = useNavigate();
  
  // Use the shared logic hook
  const {
    organizationChanges: data,
    isLoading: loading,
    isSubmitting,
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

  // UI States (kept in this specific hook)
  const [isEditOrgOpen, setIsEditOrgOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<OrganizationChangeItem | null>(null);

  // Wrappers to maintain compatibility or add specific logic
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
    isSubmitting,
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

export default useOrganizationHistory;