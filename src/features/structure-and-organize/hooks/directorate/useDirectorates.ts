import { useEffect, useMemo, useState } from 'react';
import { useApiDirectorates } from '../api/useApiDirectorates';
import { useModal } from '../../../../hooks/useModal';
import { useFileStore } from '@/stores/fileStore';
import { DirectorateListItem } from '../../types/OrganizationApiTypes';
import { DirectorateRow } from '../../types/OrganizationTableTypes';

export const useDirectorates = () => {
  const api = useApiDirectorates();
  const addModal = useModal(false);
  const editModal = useModal(false);
  const deleteModal = useModal(false);
  const [selected, setSelected] = useState<DirectorateListItem | null>(null);
  const fileStore = useFileStore();

  const { fetchDirectorates } = api;

  useEffect(() => {
    fetchDirectorates();
  }, [fetchDirectorates]);

  const rows: DirectorateRow[] = useMemo(() => {
    return (api.directorates || []).map((d, idx) => ({
      no: idx + 1,
      'direktorat-name': d.name ?? '—',
      'deskripsi-umum': d.description ?? '—',
      'file-sk-dan-memo': d.skFile ?? '-',
      fileUrl: d.skFile?.fileUrl ?? null,
      raw: d,
    }));
  }, [api.directorates]);

  const exportToCSV = (filename: string) => {
    if (!rows || rows.length === 0) return;
    const headers = Object.keys(rows[0]).filter(key => key !== 'raw' && key !== 'fileUrl');
    const csv = [
      headers.join(','),
      ...rows.map(r => headers.map(h => JSON.stringify((r as any)[h] ?? '')).join(','))
    ].join('\n');
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

  const handleEditOpen = (item: DirectorateListItem) => {
    setSelected(item);
    editModal.openModal();
  };

  const handleDeleteOpen = (item: DirectorateListItem) => {
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
    api.fetchDirectorates();
    addModal.closeModal();
    editModal.closeModal();
    deleteModal.closeModal();
  };

  return {
    ...api,
    rows,
    selected,
    addModal,
    editModal,
    deleteModal,
    fileStore,
    exportToCSV,
    handleAddOpen,
    handleEditOpen,
    handleDeleteOpen,
    handleClose,
    handleSuccess,
  };
};
