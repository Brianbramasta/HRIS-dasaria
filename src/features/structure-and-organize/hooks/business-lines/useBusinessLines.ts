import { useEffect, useMemo, useState } from 'react';
import { useApiBusinessLines } from '../api/useApiBusinessLines';
import { useModal } from '../../../../hooks/useModal';
import { useFileStore } from '@/stores/fileStore';
import { BusinessLineListItem } from '../../types/OrganizationApiTypes';
import { BLRow } from '../../types/OrganizationTableTypes';

export const useBusinessLines = ({ autoFetch = true }: { autoFetch?: boolean } = {}) => {
  const api = useApiBusinessLines();
  
  const addModal = useModal(false);
  const editModal = useModal(false);
  const deleteModal = useModal(false);
  
  const [selected, setSelected] = useState<BusinessLineListItem | null>(null);
  const fileStore = useFileStore();

  const { fetchBusinessLines } = api;

  useEffect(() => {
    if (autoFetch) {
      fetchBusinessLines();
    }
  }, [fetchBusinessLines, autoFetch]);

  const rows_column: BLRow[] = useMemo(() => {
      return (api.businessLines || []).map((b, idx) => ({
        id: (b as any).id,
        no: idx + 1,
        'lini-bisnis': (b as any).name ?? '—',
        'deskripsi-umum': (b as any).description ?? '—',
        'file-sk-dan-memo': ((b as any).skFile || (b as any).memoFile) ? 'Ada' : '—',
        raw: b
      }));
    }, [api.businessLines]);

  const handleAddOpen = () => {
    addModal.openModal();
  };

  const handleEditOpen = async (item: BusinessLineListItem) => {
    // Fetch detail logic moved here
    const detail = await api.getById(item.id);
    setSelected(detail || item);
    editModal.openModal();
  };

  const handleDeleteOpen = (item: BusinessLineListItem) => {
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
    api.fetchBusinessLines();
    addModal.closeModal();
    editModal.closeModal();
    deleteModal.closeModal();
  };

  return {
    ...api,
    rows_column,
    selected,
    setSelected,
    addModal,
    editModal,
    deleteModal,
    fileStore,
    handleAddOpen,
    handleEditOpen,
    handleDeleteOpen,
    handleClose,
    handleSuccess,
  };
};
