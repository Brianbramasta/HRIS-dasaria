import { useEffect, useMemo, useState } from 'react';
import { useApiDivisions } from '../api/useApiDivisions';
import { useModal } from '../../../../hooks/useModal';
import { useFileStore } from '@/stores/fileStore';
import { DivisionListItem } from '../../types/OrganizationApiTypes';

export const useDivisions = () => {
  // Gunakan hook API yang baru
  const api = useApiDivisions();
  
  const addModal = useModal(false);
  const editModal = useModal(false);
  const deleteModal = useModal(false);
  const [selected, setSelected] = useState<DivisionListItem | null>(null);
  const fileStore = useFileStore();

  // Sinkronisasi data ketika parameter berubah
  useEffect(() => {
    api.fetchDivisions();
  }, [
    api.fetchDivisions, 
    api.page, 
    api.pageSize, 
    api.search, 
    api.sortBy, 
    api.sortOrder, 
    api.filterValue
  ]);

  const rows: any[] = useMemo(() => {
    return (api.divisions || []).map((d: DivisionListItem, idx: number) => ({
      no: idx + 1,
      'nama-divisi': d.name ?? '—',
      'direktorat': d.directorateName ?? '—',
      'deskripsi-umum': d.description ?? '—',
      'file-sk-dan-memo': d.skFile ?? '_',
      raw: d,
    }));
  }, [api.divisions]);

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

  const handleEditOpen = async (item: DivisionListItem) => {
    if (item.id) {
      const detail = await api.getById(item.id);
      if (detail) {
        setSelected(detail);
      } else {
        setSelected(item);
      }
    } else {
      setSelected(item);
    }
    editModal.openModal();
  };

  const handleDeleteOpen = (item: DivisionListItem) => {
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
    api.fetchDivisions();
    handleClose();
  };

  return {
    ...api, // Spread API return values (divisions, loading, etc.)
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
