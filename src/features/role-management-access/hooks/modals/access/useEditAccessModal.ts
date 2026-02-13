import { useState, useCallback, useEffect } from 'react';
import type { AccessData } from '../../useAccessDetail';
import { useApiAccess } from '../../api/useApiAccess';
import { UpdateAccessPayload } from '../../../types/dto/AccessType';

export const useEditAccessModal = (
  isOpen: boolean,
  onClose: () => void,
  initialData: AccessData | null,
  onSuccess?: () => void
) => {
  const { updateAccess, loading } = useApiAccess();

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

  const handleSubmit = useCallback(async () => {
    if (!initialData) return;
    if (!akses.trim() || !deskripsi.trim()) return;

    const payload: UpdateAccessPayload = {
      name: akses,
      describe: deskripsi,
    };

    const success = await updateAccess(initialData.idAkses, payload);
    if (success) {
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [initialData, akses, deskripsi, updateAccess, onClose, onSuccess]);

  return {
    akses,
    code,
    deskripsi,
    fitur,
    loading,
    handleAksesChange,
    handleCodeChange,
    handleDeskripsiChange,
    handleFiturChange,
    handleSubmit,
  };
};
