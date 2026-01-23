import { useEffect, useMemo, useState } from 'react';
import { useApiLengthOfServiceAllowance } from '../../api/fixed-allowance/useApiLengthOfServiceAllowance';
import { useModal } from '@/hooks/useModal';
import { 
  LengthOfServiceAllowanceListItem, 
  LengthOfServiceAllowanceDetailResponse,
  LengthOfServiceAllowanceUpdatePayload 
} from '@/features/payroll/types/dto/fixed-allowance/LengthOfServiceAllowanceType';

export const useLengthOfServiceAllowance = ({ autoFetch = true }: { autoFetch?: boolean } = {}) => {
  const api = useApiLengthOfServiceAllowance();
  
  const editModal = useModal(false);
  
  // Selected item can be the list item or the full detail
  const [selected, setSelected] = useState<LengthOfServiceAllowanceDetailResponse | LengthOfServiceAllowanceListItem | null>(null);

  const { fetchItems, updateItem, getItemDetail } = api;

  useEffect(() => {
    if (autoFetch) {
      fetchItems();
    }
  }, [fetchItems, autoFetch]);

  // Mapping data to table rows
  // The page expects: lamaKerja, nominal (formatted string?)
  // The API returns: lengthOfService, nominalValue (number)
  const lengthOfServiceRows = useMemo(() => {
    return (api.items || []).map((item: LengthOfServiceAllowanceListItem) => ({
      ...item,
      // Map API fields to UI fields expected by the current page structure if we want to minimize page changes,
      // or we update the page to use API fields.
      // Based on FixedAllowancePage.tsx: { id, lamaKerja, nominal }
      lamaKerja: item.lengthOfService,
      nominal: item.nominalValue, // Keep as number, format in UI
    }));
  }, [api.items]);

  const handleEditOpen = async (item: LengthOfServiceAllowanceListItem) => {
    // Fetch detail as requested
    // "pastikan juga ketika bka modal jalankan ... getItemDetail"
    const detail = await getItemDetail(item.id);
    
    if (detail) {
      setSelected(detail);
    } else {
      setSelected(item); // Fallback to list item if detail fails
    }
    
    editModal.openModal();
  };

  const handleClose = () => {
    setSelected(null);
    editModal.closeModal();
  };

  const handleSuccess = () => {
    api.fetchItems();
    editModal.closeModal();
    setSelected(null);
  };
  
  const handleUpdate = async (values: LengthOfServiceAllowanceUpdatePayload) => {
    if (!selected) return;
    await updateItem(selected.id, values);
    // updateItem returns null on success (based on hook implementation) or we can check error
    if (!api.error) {
      handleSuccess();
    }
  };

  return {
    ...api,
    lengthOfServiceRows,
    selected,
    setSelected,
    editModal,
    handleEditOpen,
    handleClose,
    handleSuccess,
    handleUpdate,
  };
};
