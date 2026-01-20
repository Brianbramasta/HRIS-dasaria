import { useEffect, useMemo, useState } from 'react';
import { useApiOffices } from '../api/useApiOffices';
import { useModal } from '../../../../hooks/useModal';
import { useFileStore } from '@/stores/fileStore';
import { OfficeListItem } from '../../types/OrganizationApiTypes';

export const useOffices = () => {
  const api = useApiOffices();
  
  const addModal = useModal(false);
  const editModal = useModal(false);
  const deleteModal = useModal(false);
  const [selected, setSelected] = useState<OfficeListItem | null>(null);
  const fileStore = useFileStore();

  const { fetchOffices } = api;

  useEffect(() => {
    fetchOffices();
  }, [fetchOffices]);

  const rows = useMemo(() => {
    return (api.offices || []).map((o, idx) => ({
      no: idx + 1,
      'nama-kantor': (o as any).name ?? '—',
      'deskripsi-umum': (o as any).description ?? '—',
      'file-sk-dan-memo': (o as any).skFile ??'-',
      raw: o,
    }));
  }, [api.offices]);

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

  const handleEditOpen = (item: OfficeListItem) => {
    setSelected(item);
    editModal.openModal();
  };

  const handleDeleteOpen = (item: OfficeListItem) => {
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
    api.fetchOffices();
    addModal.closeModal();
    editModal.closeModal();
    deleteModal.closeModal();
  };

  return {
    ...api,
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
