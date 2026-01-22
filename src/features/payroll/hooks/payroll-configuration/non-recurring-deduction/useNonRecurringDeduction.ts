import { useEffect, useMemo, useState } from 'react';
import { useApiDeduction } from '../../api/useApiDeduction';
import { useModal } from '@/hooks/useModal';
import { DeductionCreatePayload, DeductionUpdatePayload } from '../../../types/dto/DeductionType';

export type NonRecurringDeductionForm = {
  namaPotongan: string;
  deskripsiUmum: string;
};

export const useNonRecurringDeduction = () => {
  const api = useApiDeduction();
  
  const addModal = useModal(false);
  const editModal = useModal(false);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailValues, setDetailValues] = useState<NonRecurringDeductionForm | null>(null);

  // Initial Fetch with category filter
  useEffect(() => {
    // Cast filter to any to support custom category property
    api.fetchDeductions({ filter: { category: 'notfixed' } as any });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Refresh helper
  const refreshData = () => {
    api.fetchDeductions({ filter: { category: 'notfixed' } as any });
  };

  const rows = useMemo(() => {
    return api.deductions.map((item, index) => ({
      id: item.id,
      no: (api.page - 1) * api.pageSize + index + 1,
      deductionName: item.deductionName,
      description: item.description ?? '',
      original: item, // Keep original reference if needed
    }));
  }, [api.deductions, api.page, api.pageSize]);

  const handleAddOpen = () => {
    setDetailValues(null);
    setSelectedId(null);
    addModal.openModal();
  };

  const handleEditOpen = async (id: string) => {
    // Requirement: Call getDeductionDetail when opening modal
    const detail = await api.getDeductionDetail(id);
    if (detail) {
      setDetailValues({
        namaPotongan: detail.deductionName,
        deskripsiUmum: detail.description || '',
      });
      setSelectedId(id);
      editModal.openModal();
    }
  };

  const handleDelete = async (id: string) => {
    // You might want to show a confirmation modal here or in the UI
    const success = await api.deleteDeduction(id);
    if (success) {
      refreshData();
    }
  };

  const handleSave = async (values: NonRecurringDeductionForm) => {
    const payload: DeductionCreatePayload | DeductionUpdatePayload = {
      deductionName: values.namaPotongan,
      category: 'notfixed',
      description: values.deskripsiUmum,
    };

    let success = false;
    if (selectedId) {
      success = await api.updateDeduction(selectedId, payload);
      if (success) editModal.closeModal();
    } else {
      success = await api.createDeduction(payload as DeductionCreatePayload);
      if (success) addModal.closeModal();
    }

    if (success) {
      refreshData();
    }
  };

  return {
    // API State & Actions
    loading: api.loading,
    total: api.total,
    page: api.page,
    pageSize: api.pageSize,
    setPage: api.setPage,
    setPageSize: api.setPageSize,
    setSearch: api.setSearch,
    setSort: api.setSort,
    
    // Mapped Data
    rows,
    
    // Modal State
    addModal,
    editModal,
    detailValues,
    
    // Handlers
    handleAddOpen,
    handleEditOpen,
    handleDelete,
    handleSave,
  };
};
