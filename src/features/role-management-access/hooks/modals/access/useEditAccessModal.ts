import { useState, useCallback, useEffect } from 'react';
import type { AccessData } from '../../useAccessDetail';

export const useEditAccessModal = (
  isOpen: boolean,
  onClose: () => void,
  initialData: AccessData | null
) => {
  const [akses, setAkses] = useState('');
  const [fitur, setFitur] = useState('');

  useEffect(() => {
    if (isOpen && initialData) {
      setAkses(initialData.akses);
      setFitur(initialData.fitur);
    }
  }, [isOpen, initialData]);

  const handleAksesChange = useCallback((value: string) => {
    setAkses(value);
  }, []);

  const handleFiturChange = useCallback((value: string) => {
    setFitur(value);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!initialData) return;
    if (!akses.trim() || !fitur.trim()) return;
    console.log('Updating access:', { ...initialData, akses, fitur });
    onClose();
  }, [initialData, akses, fitur, onClose]);

  return {
    akses,
    fitur,
    handleAksesChange,
    handleFiturChange,
    handleSubmit,
  };
};
