import { useEffect, useMemo, useState } from 'react';
import { useApiJobTitles } from '../api/useApiJobTitles';
import { useModal } from '../../../../hooks/useModal';
import { useFileStore } from '@/stores/fileStore';
import { PositionListItem } from '../../types/OrganizationApiTypes';
import { PositionRow } from '../../types/OrganizationTableTypes';

export const usePositions = () => {
  // Gunakan hook API yang baru
  const api = useApiJobTitles();
  
  const addModal = useModal(false);
  const editModal = useModal(false);
  const deleteModal = useModal(false);
  const [selected, setSelected] = useState<PositionListItem | null>(null);
  const fileStore = useFileStore();

  const { fetchPositions } = api;

  // Sinkronisasi data ketika parameter berubah
  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  const rows: PositionRow[] = useMemo(() => {
    return (api.positions || []).map((p, idx) => ({
      no: idx + 1,
      'nama-jabatan': (p as any).name ?? '—',
      'grade': (p as any).grade ?? (p as any).level ?? '—',
      'deskripsi-tugas': (p as any).jobDescription ?? (p as any).description ?? '—',
      'jabatan-struktural': Array.isArray((p as any).structuralJobs) ? (p as any).structuralJobs.join(', ') : '—',
      'file-sk-dan-mou': (p as any).skFile ?? '—',
      raw: p,
    }));
  }, [api.positions]);

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

  const handleEditOpen = (item: PositionListItem) => {
    setSelected(item);
    editModal.openModal();
  };

  const handleDeleteOpen = (item: PositionListItem) => {
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
    api.fetchPositions();
    addModal.closeModal();
    editModal.closeModal();
    deleteModal.closeModal();
  };

  return {
    ...api, // Spread API return values (positions, loading, etc.)
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
