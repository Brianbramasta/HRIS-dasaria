import { useEffect, useMemo, useState } from 'react';
import { useApiMarriageAllowance } from '../../api/fixed-allowance/useApiMarriageAllowance';
import { useModal } from '@/hooks/useModal';
import { MarriageAllowanceListItem, MarriageAllowanceUpdatePayload } from '@/features/payroll/types/dto/fixed-allowance/MarriageAllowanceType';

export const useMarriageAllowance = ({ autoFetch = true }: { autoFetch?: boolean } = {}) => {
  const api = useApiMarriageAllowance();
  
  const editModal = useModal(false);
  
  const [selected, setSelected] = useState<MarriageAllowanceListItem | null>(null);

  const { fetchMarriageAllowances, updateMarriageAllowance } = api;

  useEffect(() => {
    if (autoFetch) {
      fetchMarriageAllowances();
    }
  }, [fetchMarriageAllowances, autoFetch]);

  // Mapping data to table rows if needed, or just return raw data
  // The page seems to use DocumentsTable which expects specific columns.
  // We can pass the raw data and handle rendering in the page, or map it here.
  // Looking at the page code, it expects: { id, statusPernikahan, status, tanggungan, nominal }
  
  const marriageAllowanceRows = useMemo(() => {
    return (api.marriageAllowances || []).map((item) => ({
      ...item,
      // Map API fields to UI fields expected by the current page structure if we want to minimize page changes,
      // OR we update the page to use API fields. 
      // Let's update the page to use API fields, but for now we can provide a compatible view or just raw.
      // The page expects: statusPernikahan, status, tanggungan, nominal (formatted string?)
      // The API returns: code, category, dependents, nominalValue (number)
      
      statusPernikahan: item.code,
      status: item.category,
      tanggungan: item.dependents,
      nominal: item.nominalValue, // Keep as number, format in UI
    }));
  }, [api.marriageAllowances]);

  const handleEditOpen = (item: MarriageAllowanceListItem) => {
    setSelected(item);
    editModal.openModal();
  };

  const handleClose = () => {
    setSelected(null);
    editModal.closeModal();
  };

  const handleSuccess = () => {
    api.fetchMarriageAllowances();
    editModal.closeModal();
    setSelected(null);
  };
  
  const handleUpdate = async (values: MarriageAllowanceUpdatePayload) => {
    if (!selected) return;
    const result = await updateMarriageAllowance(selected.id, values);
    if (result) {
      handleSuccess();
    }
  };

  return {
    ...api,
    marriageAllowanceRows,
    selected,
    setSelected,
    editModal,
    handleEditOpen,
    handleClose,
    handleSuccess,
    handleUpdate,
  };
};
