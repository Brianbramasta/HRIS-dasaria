import { useEffect, useMemo, useState } from 'react';
import { useApiTransportationAllowance } from '../../api/fixed-allowance/useApiTransportationAllowance';
import { useModal } from '@/hooks/useModal';
import { 
  TransportationAllowanceListItem, 
  TransportationAllowanceDetailResponse, 
  TransportationAllowanceUpdatePayload 
} from '@/features/payroll/types/dto/fixed-allowance/TransportationAllowanceType';

export const useTransportationAllowance = ({ autoFetch = true }: { autoFetch?: boolean } = {}) => {
  const api = useApiTransportationAllowance();
  
  const editModal = useModal(false);
  
  const [selected, setSelected] = useState<TransportationAllowanceDetailResponse | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { fetchTransportationAllowances, updateTransportationAllowance, getTransportationAllowanceDetail } = api;

  useEffect(() => {
    if (autoFetch) {
      fetchTransportationAllowances();
    }
  }, [fetchTransportationAllowances, autoFetch]);

  const transportationAllowanceRows = useMemo(() => {
    return (api.transportationAllowances || []).map((item) => ({
      ...item,
      // Map for UI
      transportasi: item.nameTransportation,
      kategori: item.categoryName,
      nominal: item.nominalValue,
    }));
  }, [api.transportationAllowances]);

  const handleEditOpen = async (item: TransportationAllowanceListItem) => {
    setSelectedId(item.id);
    const detail = await getTransportationAllowanceDetail(item.id);
    if (detail) {
      setSelected(detail);
      editModal.openModal();
    }
  };

  const handleClose = () => {
    setSelected(null);
    setSelectedId(null);
    editModal.closeModal();
  };

  const handleSuccess = () => {
    api.fetchTransportationAllowances();
    handleClose();
  };
  
  const handleUpdate = async (values: TransportationAllowanceUpdatePayload) => {
    if (!selectedId) return;
    const result = await updateTransportationAllowance(selectedId, values);
    if (result) {
      handleSuccess();
    }
  };

  return {
    ...api,
    transportationAllowanceRows,
    selected,
    selectedId,
    setSelected,
    editModal,
    handleEditOpen,
    handleClose,
    handleSuccess,
    handleUpdate,
  };
};
