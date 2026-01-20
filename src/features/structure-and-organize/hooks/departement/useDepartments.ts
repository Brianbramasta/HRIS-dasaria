import { useEffect, useMemo, useState } from 'react';
import { useApiDepartments } from '../api/useApiDepartments';
import { useModal } from '../../../../hooks/useModal';
import { useFileStore } from '@/stores/fileStore';
import { DepartmentListItem } from '../../types/OrganizationApiTypes';

export const useDepartments = () => {
  // Gunakan hook API yang baru
  const api = useApiDepartments();
  
  const addModal = useModal(false);
  const editModal = useModal(false);
  const deleteModal = useModal(false);
  const [selected, setSelected] = useState<DepartmentListItem | null>(null);
  const fileStore = useFileStore();

  const { fetchDepartments } = api;

  // Sinkronisasi data ketika parameter berubah
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // Perbaikan: tambahkan tipe eksplisit pada parameter callback map untuk menghindari implicit any
  const rows: any[] = useMemo(() => {
    return (api.departments || []).map((d: DepartmentListItem, idx: number) => ({
      no: idx + 1,
      'nama-departemen': (d as any).name ?? '—',
      'nama-divisi': (d as any).divisionName ?? '—',
      'file-sk-dan-memo': (d as any).skFile ?? '_',
      raw: d,
    }));
  }, [api.departments]);

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

  const handleEditOpen = (item: DepartmentListItem) => {
    setSelected(item);
    editModal.openModal();
  };

  const handleDeleteOpen = (item: DepartmentListItem) => {
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
    api.fetchDepartments();
    addModal.closeModal();
    editModal.closeModal();
    deleteModal.closeModal();
  };

  return {
    ...api, // Spread API return values (departments, loading, etc.)
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
