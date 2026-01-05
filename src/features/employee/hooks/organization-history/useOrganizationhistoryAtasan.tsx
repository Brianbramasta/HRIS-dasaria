import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useOrganizationChange,
  type  UseOrganizationChangeOptions,
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
    detail,
    getDetail,
  } = useOrganizationChange({ ...options, autoFetch: false });

  // UI States
  const [isEditOrgOpen, setIsEditOrgOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<OrganizationChangeItem | null>(null);

  // Wrappers
  const fetchOrganizationHistory = useCallback(
    async () => {
      await fetchOrganizationChanges('DSR001');
    },
    [fetchOrganizationChanges]
  );

  const createOrganizationHistory = useCallback(
    async (employeeId: string, payload: CreateOrganizationChangePayload) => {
      const enrichedPayload: CreateOrganizationChangePayload = {
        ...payload,
        approved_by: 'di approve manual tanpa login ',
      };
      const success = await createOrgChange('DSR001', enrichedPayload);
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

  useEffect(() => {
    fetchOrganizationHistory();
  }, [fetchOrganizationHistory]);

  // UI Handlers
  const handleAddOrganization = useCallback(() => {
    setSelectedRow(null);
    setIsEditOrgOpen(true);
  }, []);

  const handleEditOrganization = useCallback(async (row: OrganizationChangeItem) => {
    setSelectedRow(row);
    setIsEditOrgOpen(true);
    await getDetail(row.id);
  }, [getDetail]);

  const handleCloseModal = useCallback(() => {
    setIsEditOrgOpen(false);
    setSelectedRow(null);
  }, []);

  const handleSubmitModal = useCallback(
    async (formData: any) => {
      const isEdit = !!selectedRow;
      if (isEdit && selectedRow) {
        const payload: UpdateOrganizationChangePayload = {
          decree_file: formData?.skFile ?? null,
        };
        const ok = await updateOrganizationHistory(selectedRow.id, payload);
        if (ok) {
          setIsEditOrgOpen(false);
          setSelectedRow(null);
        }
        return;
      }
      const employeeId = formData?.employee_id || formData?.nip || '';
      const payload: CreateOrganizationChangePayload = {
        employee_id: formData?.employee_id || '',
        change_type_id: formData?.change_type_id || '',
        efektif_date: formData?.efektif_date || '',
        reason: formData?.reason || '',
        company_id: formData?.company_id || '',
        office_id: formData?.office_id || '',
        directorate_id: formData?.directorate_id || '',
        division_id: formData?.division_id || '',
        department_id: formData?.department_id || '',
        job_title_id: formData?.job_title_id || '',
        position_id: formData?.position_id || '',
        position_level_id: formData?.position_level_id || '',
        employee_category_id: formData?.employee_category_id || '',
        decree_file: formData?.skFile ?? null,
      };
      const ok = await createOrganizationHistory(employeeId, payload);
      if (ok) {
        setIsEditOrgOpen(false);
        setSelectedRow(null);
      }
    },
    [selectedRow, updateOrganizationHistory, createOrganizationHistory]
  );

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
    detail,
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
    handleEditOrganization,
    handleCloseModal,
    handleSubmitModal,
    handleDropdownToggle,
    handleDropdownClose,
    handleNavigateToHR,
    handleNavigateToAtasan,
  };
}

export default useOrganizationHistoryAtasan;
