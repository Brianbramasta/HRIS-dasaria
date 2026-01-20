import { useEffect, useMemo, useState } from 'react';
import { useApiEmployeePositions } from '../api/useApiEmployeePositions';
import { useModal } from '../../../../hooks/useModal';
import { useFileStore } from '@/stores/fileStore';
import { EmployeePositionListItem } from '../../types/OrganizationApiTypes';

export const useEmployeePositions = () => {
  // Gunakan hook API yang baru
  const api = useApiEmployeePositions();
  
  const addModal = useModal(false);
  const editModal = useModal(false);
  const deleteModal = useModal(false);
  const [selected, setSelected] = useState<EmployeePositionListItem | null>(null);
  const fileStore = useFileStore();

  const { fetchEmployeePositions } = api;

  // Sinkronisasi data ketika parameter berubah
  useEffect(() => {
    fetchEmployeePositions();
  }, [fetchEmployeePositions]);

  const rows: any[] = useMemo(() => {
    return (api.employeePositions || []).map((ep: EmployeePositionListItem, idx: number) => ({
      id: ep.id,
      no: idx + 1,
      'nama-posisi': ep.name ?? ep.positionName ?? '—',
      'jabatan': ep.positionName ?? '—',
      'direktorat': ep.directorateName ?? '—',
      'divisi': ep.divisionName ?? '—',
      'departemen': ep.departmentName ?? '—',
      'file-sk-dan-mou': ep.skFile ?? '—',
      fileUrl: ep.skFile?.fileUrl ?? undefined,
      raw: ep,
    }));
  }, [api.employeePositions]);

  const exportCSV = (filename: string, data: any[]) => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csv = [headers.join(','), ...data.map(r => headers.map(h => JSON.stringify((r as any)[h] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAddOpen = () => {
    addModal.openModal();
  };

  const handleEditOpen = (item: EmployeePositionListItem) => {
    setSelected(item);
    editModal.openModal();
  };

  const handleDeleteOpen = (item: EmployeePositionListItem) => {
    setSelected(item);
    deleteModal.openModal();
  };

  const handleClose = () => {
    setSelected(null);
    fileStore.clearSkFile();
    addModal.closeModal();
    editModal.closeModal();
    deleteModal.closeModal();
  };

  const handleSuccess = () => {
    api.fetchEmployeePositions();
    addModal.closeModal();
    editModal.closeModal();
    deleteModal.closeModal();
  };

  return {
    ...api, // Spread API return values
    rows,
    selected,
    setSelected,
    addModal,
    editModal,
    deleteModal,
    fileStore,
    exportCSV,
    handleAddOpen,
    handleEditOpen,
    handleDeleteOpen,
    handleClose,
    handleSuccess,
  };
};
