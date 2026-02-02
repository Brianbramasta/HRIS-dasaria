import { useState, useCallback, useEffect } from 'react';
import { ModulData } from '../../useModulDetail';

export const useEditModulModal = (
  isOpen: boolean, 
  onClose: () => void,
  initialData: ModulData | null
) => {
  const [modulName, setModulName] = useState('');

  useEffect(() => {
    if (isOpen && initialData) {
      setModulName(initialData.modul);
    }
  }, [isOpen, initialData]);

  const handleModulChange = useCallback((value: string) => {
    setModulName(value);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!initialData) return;
    
    // Validasi sederhana
    if (!modulName.trim()) {
      // Bisa tambahkan error handling jika perlu
      return;
    }

    console.log('Updating modul:', { ...initialData, modul: modulName });
    // Di sini nanti panggil API update
    onClose();
  }, [initialData, modulName, onClose]);

  return {
    modulName,
    handleModulChange,
    handleSubmit,
  };
};
