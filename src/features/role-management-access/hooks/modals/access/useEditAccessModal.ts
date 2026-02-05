import { useState, useCallback, useEffect } from 'react';
import type { AccessData } from '../../useAccessDetail';

export const useEditAccessModal = (
  isOpen: boolean,
  onClose: () => void,
  initialData: AccessData | null
) => {
  const [akses, setAkses] = useState('');
  const [code, setCode] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [fitur, setFitur] = useState('');

  useEffect(() => {
    if (isOpen && initialData) {
      setAkses(initialData.akses);
      setCode(initialData.code || '');
      setDeskripsi(initialData.deskripsi || '');
      setFitur(initialData.fitur);
    }
  }, [isOpen, initialData]);

  const handleAksesChange = useCallback((value: string) => {
    setAkses(value);
  }, []);

  const handleCodeChange = useCallback((value: string) => {
    setCode(value);
  }, []);

  const handleDeskripsiChange = useCallback((value: string) => {
    setDeskripsi(value);
  }, []);

  const handleFiturChange = useCallback((value: string) => {
    setFitur(value);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!initialData) return;
    if (!akses.trim() || !code.trim() || !deskripsi.trim()) return;
    console.log('Updating access:', { ...initialData, akses, code, deskripsi, fitur });
    onClose();
  }, [initialData, akses, code, deskripsi, fitur, onClose]);

  return {
    akses,
    code,
    deskripsi,
    fitur,
    handleAksesChange,
    handleCodeChange,
    handleDeskripsiChange,
    handleFiturChange,
    handleSubmit,
  };
};
