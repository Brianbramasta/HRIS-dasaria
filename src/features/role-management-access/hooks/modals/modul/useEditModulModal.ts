import { useState, useCallback, useEffect } from 'react';
import { ModulData } from '../../useModulDetail';
import { useApiModules } from '../../api/useApiModules';

export const useEditModulModal = (
  isOpen: boolean, 
  onClose: () => void,
  initialData: ModulData | null,
  onSuccess?: () => void
) => {
  const [modulName, setModulName] = useState('');
  const { updateModule, loading } = useApiModules();

  useEffect(() => {
    if (isOpen && initialData) {
      setModulName(initialData.modul);
    }
  }, [isOpen, initialData]);

  const handleModulChange = useCallback((value: string) => {
    setModulName(value);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!initialData) return;
    
    // Validasi sederhana
    if (!modulName.trim()) {
      // Bisa tambahkan error handling jika perlu
      return;
    }

    const success = await updateModule(initialData.idModul, {
      name: modulName
    });

    if (success) {
      onSuccess?.();
      onClose();
    }
  }, [initialData, modulName, updateModule, onSuccess, onClose]);

  return {
    modulName,
    handleModulChange,
    handleSubmit,
    loading,
  };
};
