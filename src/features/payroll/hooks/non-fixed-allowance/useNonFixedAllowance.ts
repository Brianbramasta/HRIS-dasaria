import { useEffect, useMemo, useState } from 'react';
import { useApiNonFixedAllowance } from '../api/non-fixed-allowance/useApiNonFixedAllowance';
import { useModal } from '@/hooks/useModal';
import { NonFixedAllowanceListItem } from '../../types/dto/non-fixed-allowance/NonFixedAllowanceType';

export const useNonFixedAllowance = ({ autoFetch = true }: { autoFetch?: boolean } = {}) => {
  const api = useApiNonFixedAllowance();
  
  const addModal = useModal(false);
  const editModal = useModal(false);
  const deleteModal = useModal(false);
  
  const [selected, setSelected] = useState<NonFixedAllowanceListItem | null>(null);

  const { fetchList } = api;

  useEffect(() => {
    if (autoFetch) {
      fetchList();
    }
  }, [fetchList, autoFetch]);

  const rows = useMemo(() => {
    return (api.data || []).map((item, idx) => ({
      id: item.id,
      no: (api.page - 1) * api.pageSize + idx + 1,
      'Nama Tunjangan': item.allowanceName,
      'Deksripsi Umum': item.description,
      raw: item,
    }));
  }, [api.data, api.page, api.pageSize]);

  const handleAddOpen = () => {
    setSelected(null);
    addModal.openModal();
  };

  const handleEditOpen = async (item: NonFixedAllowanceListItem) => {
    // Fetch detail logic
    const detail = await api.getDetail(item.id);
    if (detail) {
        // Map detail back to list item format if needed, or just use what we have
        // Since the edit modal usually expects the list item or a specific shape
        // We'll update the selected state with the detail data merged or mapped
        setSelected({
            id: detail.id,
            allowanceName: detail.allowanceName,
            categorySub: detail.categorySub,
            description: detail.description
        });
    } else {
        setSelected(item);
    }
    editModal.openModal();
  };

  const handleDeleteOpen = (item: NonFixedAllowanceListItem) => {
    setSelected(item);
    deleteModal.openModal();
  };

  const handleClose = () => {
    setSelected(null);
    addModal.closeModal();
    editModal.closeModal();
    deleteModal.closeModal();
  };

  const handleSuccess = () => {
    api.fetchList();
    handleClose();
  };

  return {
    ...api,
    rows,
    selected,
    setSelected,
    addModal,
    editModal,
    deleteModal,
    handleAddOpen,
    handleEditOpen,
    handleDeleteOpen,
    handleClose,
    handleSuccess,
  };
};
