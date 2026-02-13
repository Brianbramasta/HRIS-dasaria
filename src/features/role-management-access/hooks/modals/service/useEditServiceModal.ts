import { useState, useCallback, useEffect } from 'react';
import { LayananData } from '../../useRoleManagement';
import { useApiApps } from '../../api/useApiApps';

export const useEditServiceModal = (
  isOpen: boolean, 
  onClose: () => void,
  initialData: LayananData | null,
  onSuccess?: () => void
) => {
  const [serviceName, setServiceName] = useState('');
  const { updateApp } = useApiApps();

  useEffect(() => {
    if (isOpen && initialData) {
      setServiceName(initialData.sistemLayanan);
    }
  }, [isOpen, initialData]);

  const handleServiceChange = useCallback((value: string) => {
    setServiceName(value);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!initialData) return;
    
    // Validasi sederhana
    if (!serviceName.trim()) {
      // Bisa tambahkan error handling jika perlu
      return;
    }

    const payload = {
      name: serviceName
    };

    const success = await updateApp(initialData.idLayanan, payload);

    if (success) {
      onSuccess?.();
      onClose();
    }
  }, [initialData, serviceName, updateApp, onSuccess, onClose]);

  return {
    serviceName,
    handleServiceChange,
    handleSubmit,
  };
};
