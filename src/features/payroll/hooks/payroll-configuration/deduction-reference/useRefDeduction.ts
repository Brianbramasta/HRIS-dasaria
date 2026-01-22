import { useState, useEffect, useMemo } from 'react';
import { useApiRefDeduction } from '../../api/useApiRefDeduction';
import { RefDeductionListItem } from '@/features/payroll/types/dto/RefDeductionType';
import { useModal } from '@/hooks/useModal';
import { formatCurrencyValue } from '@/utils/formatCurrency';

export type RefDeductionRow = {
  id: string;
  no: number;
  acuanPotongan: string;
  kategori: string;
  nominal: string;
  keterangan: string;
  raw: RefDeductionListItem;
};

export const useRefDeduction = () => {
  const api = useApiRefDeduction();
  const { fetchRefDeductions, refDeductions, page, pageSize } = api;

  const editModal = useModal(false);
  const [selected, setSelected] = useState<RefDeductionListItem | null>(null);

  useEffect(() => {
    fetchRefDeductions();
  }, [fetchRefDeductions]);

  const rows: RefDeductionRow[] = useMemo(() => {
    return (refDeductions || []).map((item, index) => ({
      id: item.id,
      no: index + 1 + (page - 1) * pageSize,
      acuanPotongan: item.referenceName,
      kategori: item.category,
      nominal: formatCurrencyValue(item.nominalValue),
      keterangan: item.description || '-',
      raw: item
    }));
  }, [refDeductions, page, pageSize]);

  const handleEditOpen = (item: RefDeductionListItem) => {
    setSelected(item);
    editModal.openModal();
  };

  const handleClose = () => {
    setSelected(null);
    editModal.closeModal();
  };

  const handleSuccess = () => {
    fetchRefDeductions();
    handleClose();
  };

  return {
    ...api,
    rows,
    editModal,
    selected,
    handleEditOpen,
    handleClose,
    handleSuccess
  };
};
