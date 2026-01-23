import { useEffect, useMemo, useState } from 'react';
import { useApiConfigurationTHR } from '../../api/useApiConfigurationTHR';
import { ConfigurationTHRListItem, ConfigurationTHRUpdatePayload } from '../../../types/dto/ConfigurationTHRType';
import { useModal } from '@/hooks/useModal';

export const useConfigurationTHR = () => {
  const api = useApiConfigurationTHR();
  const {
    fetchConfigurationTHR,
    getConfigurationTHRDetail,
    updateConfigurationTHR,
    updateStatusConfigurationTHR,
    configurations,
    page,
    pageSize,
  } = api;

  const editModal = useModal(false);
  const [selected, setSelected] = useState<ConfigurationTHRListItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchConfigurationTHR();
  }, [fetchConfigurationTHR]);

  const handleEditOpen = async (item: ConfigurationTHRListItem) => {
    setDetailLoading(true);
    try {
      const detail = await getConfigurationTHRDetail(item.id);
      if (detail) {
        // Map detail to list item format if needed, or just use detail.
        // For simplicity in state, we can store the detail or merge it.
        // The modal likely needs specific fields.
        setSelected({
            id: detail.id,
            lengthOfService: detail.lengthOfService,
            description: detail.description,
        });
      } else {
        setSelected(item);
      }
      editModal.openModal();
    } catch (error) {
      console.error('Failed to fetch detail', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleClose = () => {
    setSelected(null);
    editModal.closeModal();
  };

  const handleSave = async (values: { lamaKerja: string; deskripsiUmum: string }) => {
    if (!selected) return;

    const payload: ConfigurationTHRUpdatePayload = {
      lengthOfService: values.lamaKerja,
      description: values.deskripsiUmum,
    };

    await updateConfigurationTHR(selected.id, payload);
    // updateConfigurationTHR returns null on success (based on hook implementation) or we can just refetch
    await fetchConfigurationTHR();
    handleClose();
  };

  const handleToggleStatus = async (isActive: boolean) => {
      // Logic for toggle status if needed globally or per row.
      // The API seems to be a global update-status or per item?
      // Contract says: POST /api/payroll/payroll-configuration/holiday-allowance/mt-holiday-allowance/update-status
      // Body: is_active: string (1 = active, 0 = inactive)
      // This implies a global setting for the feature? Or for selected rows?
      // "Successfully updated holiday allowance status." "rows_updated": 2.
      // It seems it updates ALL rows or a global switch.
      // Let's assume it's a global switch for now as per the page UI "Switch label='ON'".
      await updateStatusConfigurationTHR({ isActive });
      await fetchConfigurationTHR();
  }

  // Define rows for the table
  const rows = useMemo(() => {
    return configurations.map((item, index) => ({
      id: item.id,
      no: (page - 1) * pageSize + index + 1,
      'Lama Kerja': item.lengthOfService,
      'Deksripsi Umum': item.description,
      raw: item,
    }));
  }, [configurations, page, pageSize]);

  return {
    ...api,
    rows,
    editModal,
    selected,
    detailLoading,
    handleEditOpen,
    handleClose,
    handleSave,
    handleToggleStatus
  };
};
