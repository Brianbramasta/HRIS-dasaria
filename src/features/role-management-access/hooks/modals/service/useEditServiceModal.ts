import { useState, useCallback, useEffect } from 'react';
import { LayananData } from '../../useRoleManagement';

export const useEditServiceModal = (
  isOpen: boolean, 
  onClose: () => void,
  initialData: LayananData | null
) => {
  const [serviceName, setServiceName] = useState('');

  useEffect(() => {
    if (isOpen && initialData) {
      setServiceName(initialData.sistemLayanan);
    }
  }, [isOpen, initialData]);

  const handleServiceChange = useCallback((value: string) => {
    setServiceName(value);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!initialData) return;
    
    // Validasi sederhana
    if (!serviceName.trim()) {
      // Bisa tambahkan error handling jika perlu
      return;
    }

    console.log('Updating service:', { ...initialData, sistemLayanan: serviceName });
    // Di sini nanti panggil API update
    onClose();
  }, [initialData, serviceName, onClose]);

  return {
    serviceName,
    handleServiceChange,
    handleSubmit,
  };
};
