import { useEffect, useMemo, useState } from 'react';
import { useApiFee } from '../../api/fixed-allowance/useApiFee';
import { useModal } from '@/hooks/useModal';
import { FeeListItem, FeeUpdatePayload } from '@/features/payroll/types/dto/fixed-allowance/FeeType';

export const useFeeAllowance = ({ autoFetch = true }: { autoFetch?: boolean } = {}) => {
  const api = useApiFee();
  
  const editModal = useModal(false);
  
  const [selected, setSelected] = useState<FeeListItem | null>(null);

  const { fetchFees, updateFee } = api;

  useEffect(() => {
    if (autoFetch) {
      fetchFees();
    }
  }, [fetchFees, autoFetch]);

  // Mapping data to table rows
  // API returns: { id, name, amount }
  // Table expects: { id, namaFee, nominal }
  
  const feeAllowanceRows = useMemo(() => {
    return (api.fees || []).map((item) => ({
      ...item,
      namaFee: item.name,
      nominal: item.amount,
    }));
  }, [api.fees]);

  const handleEditOpen = (item: FeeListItem) => {
    setSelected(item);
    editModal.openModal();
  };

  const handleClose = () => {
    setSelected(null);
    editModal.closeModal();
  };

  const handleSuccess = () => {
    api.fetchFees();
    editModal.closeModal();
    setSelected(null);
  };
  
  const handleUpdate = async (values: FeeUpdatePayload) => {
    if (!selected) return;
    const result = await updateFee(selected.id, values);
    if (result) {
      handleSuccess();
    }
  };

  return {
    ...api,
    feeAllowanceRows,
    selected,
    setSelected,
    editModal,
    handleEditOpen,
    handleClose,
    handleSuccess,
    handleUpdate,
  };
};
