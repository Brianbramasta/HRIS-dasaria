import { useEffect, useMemo, useState } from 'react';
import { useApiCompensation } from '../../api/useApiCompensation';
import { useModal } from '@/hooks/useModal';
import { CompensationListItem, CompensationUpdatePayload } from '../../../types/dto/CompensationType';
import { EditKompensasiForm } from '../../modals/payroll-configuration/compensation/useEditCompensationModal';
import { DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import { IconPencil } from '@/icons/components/icons';
import React from 'react';

// Tipe baris untuk DataTable
export type CompensationRow = {
  id: string;
  no: number;
  'level-jabatan': string;
  kategori: string;
  general: string;
  junior: string;
  middle: string;
  senior: string;
  raw: CompensationListItem;
};

export const useCompensation = () => {
  const api = useApiCompensation();
  const editModal = useModal(false);
  const [selected, setSelected] = useState<CompensationListItem | null>(null);

  // Auto fetch data saat mount
  useEffect(() => {
    api.fetchCompensations();
  }, []);

  // Helper formatting
  const formatCurrency = (val: number | null) => {
    if (val === null || val === undefined) return '-';
    return val.toLocaleString('id-ID');
  };

  const parseCurrency = (val: string | undefined): number | null => {
    if (!val || val === '-') return null;
    return parseInt(val.replace(/\./g, ''), 10);
  };

  // Mapping data API ke format DataTable
  const rows: CompensationRow[] = useMemo(() => {
    return api.compensations.map((item, index) => ({
      id: item.id,
      no: (api.page - 1) * api.pageSize + index + 1,
      'level-jabatan': item.jobTitleName,
      kategori: item.categoryCompensation,
      general: formatCurrency(item.amountGeneral),
      junior: formatCurrency(item.amountJunior),
      middle: formatCurrency(item.amountMiddle),
      senior: formatCurrency(item.amountSenior),
      raw: item,
    }));
  }, [api.compensations, api.page, api.pageSize]);

  // Mapping selected item ke format Form Modal
  const initialFormData: EditKompensasiForm | null = useMemo(() => {
    if (!selected) return null;
    return {
      levelJabatan: selected.jobTitleName,
      jabatanStruktural: selected.structuralJobs?.map(s => s.structuralJobName).join(', ') || selected.structuralJobName || '',
      kategori: selected.categoryCompensation,
      general: selected.amountGeneral !== null ? selected.amountGeneral.toString() : '',
      junior: selected.amountJunior !== null ? selected.amountJunior.toString() : '',
      middle: selected.amountMiddle !== null ? selected.amountMiddle.toString() : '',
      senior: selected.amountSenior !== null ? selected.amountSenior.toString() : '',
    };
  }, [selected]);

  // Handlers
  const handleEditOpen = async (item: CompensationListItem) => {
    setSelected(item);
    editModal.openModal();

    const detail = await api.getCompensationDetail(item.id);
    if (detail) {
      setSelected((prev) => {
        // Pastikan selected masih sama (user belum tutup/ganti)
        if (!prev || prev.id !== detail.id) return prev;
        
        return {
          ...prev,
          jobTitleName: detail.jobTitle.jobTitleName,
          structuralJobs: detail.jobTitle.structuralJobs,
          categoryCompensation: detail.categoryCompensation,
          amountGeneral: detail.amountGeneral,
          amountJunior: detail.amountJunior,
          amountMiddle: detail.amountMiddle,
          amountSenior: detail.amountSenior,
        };
      });
    }
  };

  const handleEditClose = () => {
    setSelected(null);
    editModal.closeModal();
  };

  const handleEditSubmit = async (formData: EditKompensasiForm) => {
    if (!selected) return;

    const payload: CompensationUpdatePayload = {
      categoryCompensation: formData.kategori || '',
      amountGeneral: parseCurrency(formData.general),
      amountJunior: parseCurrency(formData.junior),
      amountMiddle: parseCurrency(formData.middle),
      amountSenior: parseCurrency(formData.senior),
    };

    const result = await api.updateCompensation(selected.id, payload);
    
    // Jika berhasil (result tidak null atau error tidak ada), tutup modal dan refresh
    // Note: api.updateCompensation return null on error or success with no data mapping, 
    // but api.error will be set if error.
    if (!api.error) {
        handleEditClose();
        api.fetchCompensations();
    }
  };

  return {
    ...api,
    rows,
    editModal,
    selected,
    initialFormData,
    handleEditOpen,
    handleEditClose,
    handleEditSubmit,
  };
};
