import { useEffect, useMemo, useState } from 'react';
import { useApiPositionAllowance } from '../../api/fixed-allowance/useApiPositionAllowance';
import { useModal } from '@/hooks/useModal';
import { 
  PositionAllowanceListItem, 
  PositionAllowanceDetailResponse, 
  PositionAllowanceUpdatePayload 
} from '@/features/payroll/types/dto/fixed-allowance/PositionAllowanceType';

export const usePositionAllowance = ({ autoFetch = true }: { autoFetch?: boolean } = {}) => {
  const api = useApiPositionAllowance();
  
  const editModal = useModal(false);
  
  const [selected, setSelected] = useState<PositionAllowanceDetailResponse | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { fetchPositionAllowances, updatePositionAllowance, getPositionAllowanceDetail } = api;

  useEffect(() => {
    if (autoFetch) {
      fetchPositionAllowances();
    }
  }, [fetchPositionAllowances, autoFetch]);

  const positionAllowanceRows = useMemo(() => {
    return (api.positionAllowances || []).map((item) => ({
      ...item,
      // Map for UI
      jabatan: item.jobTitleName,
      presentase: item.percentageValue ? `${item.percentageValue}%` : '0%',
      nominal: item.nominalValue,
      detailBpjs: 'Detail', // Placeholder for UI requirement
    }));
  }, [api.positionAllowances]);

  const handleEditOpen = async (item: PositionAllowanceListItem) => {
    setSelectedId(item.id);
    const detail = await getPositionAllowanceDetail(item.id);
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
    api.fetchPositionAllowances();
    handleClose();
  };
  
  const handleUpdate = async (values: PositionAllowanceUpdatePayload) => {
    if (!selectedId) return;
    const result = await updatePositionAllowance(selectedId, values);
    if (result) {
      handleSuccess();
    }
  };

  return {
    ...api,
    positionAllowanceRows,
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
