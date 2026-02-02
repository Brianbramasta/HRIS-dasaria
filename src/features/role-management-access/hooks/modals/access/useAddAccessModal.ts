import { useState, useCallback, useEffect } from 'react';

export interface AccessItem {
  id: number;
  akses: string;
  code: string;
  deskripsi: string;
  fitur: string;
}

export const useAddAccessModal = (isOpen: boolean, onClose: () => void) => {
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

  const handleSubmit = useCallback(() => {
    const valid = items.filter((i) => i.akses.trim() !== '' && i.code.trim() !== '' && i.deskripsi.trim() !== '');
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
