import { useEffect, useMemo, useState } from 'react';
import { useApiBpjsItem } from '@/features/payroll/hooks/api/useApiBpjsItem';
import { useModal } from '@/hooks/useModal';
import { BpjsItemListItem } from '@/features/payroll/types/dto/BpjsItemType';

export const useBpjsPage = () => {
  const api = useApiBpjsItem();
  const editModal = useModal(false);
  const [selected, setSelected] = useState<BpjsItemListItem | null>(null);

  useEffect(() => {
    api.fetchBpjsItems();
  }, [api.fetchBpjsItems]);

  const handleEditOpen = (item: BpjsItemListItem) => {
    setSelected(item);
    editModal.openModal();
  };

  const handleClose = () => {
    setSelected(null);
    editModal.closeModal();
  };

  const handleSuccess = () => {
    api.fetchBpjsItems();
    handleClose();
  };

  const rows = useMemo(() => {
    return api.bpjsItems.map((item: BpjsItemListItem, index: number) => ({
      no: (api.page - 1) * api.pageSize + index + 1,
      id: item.id,
      detailBpjs: item.detailName,
      kategoriBpjs: item.category,
      jenis: item.type,
      percent: `${item.companyPercentage}%`, // Format for display
      original: item, // Keep original for actions
    }));
  }, [api.bpjsItems, api.page, api.pageSize]);

  return {
    ...api,
    rows,
    editModal,
    selected,
    handleEditOpen,
    handleClose,
    handleSuccess,
  };
};
