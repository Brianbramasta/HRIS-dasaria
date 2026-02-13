import { useState, useCallback, useEffect } from 'react';
import { useApiAccess } from '../../api/useApiAccess';
import { CreateAccessPayload } from '../../../types/dto/AccessType';

export interface AccessItem {
  id: number;
  akses: string;
  code: string;
  deskripsi: string;
  fitur: string;
}

export const useAddAccessModal = (
  isOpen: boolean, 
  onClose: () => void,
  featureId?: string,
  onSuccess?: () => void
) => {
  const { createAccess, loading } = useApiAccess();
  
  const [items, setItems] = useState<AccessItem[]>([
    { id: Date.now(), akses: '', code: '', deskripsi: '', fitur: '' },
  ]);
  const [nextCode, setNextCode] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setNextCode(1);
      setItems([{ id: Date.now(), akses: '', code: String(1).padStart(2, '0'), deskripsi: '', fitur: '' }]);
    }
  }, [isOpen]);

  const handleAddRow = useCallback(() => {
    setNextCode((prev) => prev + 1);
    setItems((prev) => [...prev, { id: Date.now(), akses: '', code: String(nextCode + 1).padStart(2, '0'), deskripsi: '', fitur: '' }]);
  }, [nextCode]);

  const handleRemoveRow = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const handleFieldChange = useCallback((id: number, field: 'akses' | 'code' | 'deskripsi' | 'fitur', value: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } as AccessItem : i))
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!featureId) return;

    const validItems = items.filter((i) => i.akses.trim() !== '');
    
    if (validItems.length === 0) return;

    const payload: CreateAccessPayload = {
      features_id: featureId,
      items: validItems.map((item) => ({
        name: item.akses,
        describe: item.deskripsi,
      })),
    };

    const success = await createAccess(payload);
    if (success) {
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [items, featureId, createAccess, onClose, onSuccess]);

  return {
    items,
    loading,
    handleAddRow,
    handleRemoveRow,
    handleFieldChange,
    handleSubmit,
  };
};
