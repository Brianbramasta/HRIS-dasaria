import { useState, useCallback, useEffect } from 'react';

export interface AccessItem {
  id: number;
  akses: string;
  fitur: string;
}

export const useAddAccessModal = (isOpen: boolean, onClose: () => void) => {
  const [items, setItems] = useState<AccessItem[]>([
    { id: Date.now(), akses: '', fitur: '' },
  ]);

  useEffect(() => {
    if (isOpen) {
      setItems([{ id: Date.now(), akses: '', fitur: '' }]);
    }
  }, [isOpen]);

  const handleAddRow = useCallback(() => {
    setItems((prev) => [...prev, { id: Date.now(), akses: '', fitur: '' }]);
  }, []);

  const handleRemoveRow = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const handleFieldChange = useCallback((id: number, field: 'akses' | 'fitur', value: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } as AccessItem : i))
    );
  }, []);

  const handleSubmit = useCallback(() => {
    const valid = items.filter((i) => i.akses.trim() !== '' && i.fitur.trim() !== '');
    console.log('Submitting access items:', valid);
    onClose();
  }, [items, onClose]);

  return {
    items,
    handleAddRow,
    handleRemoveRow,
    handleFieldChange,
    handleSubmit,
  };
};
