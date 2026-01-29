import { useState, useCallback, useEffect } from 'react';

export interface ModulItem {
  id: number;
  name: string;
}

export const useAddModulModal = (isOpen: boolean, onClose: () => void) => {
  const [moduls, setModuls] = useState<ModulItem[]>([{ id: Date.now(), name: '' }]);

  useEffect(() => {
    if (isOpen) {
      // Reset to initial state when modal opens
      setModuls([{ id: Date.now(), name: '' }]);
    }
  }, [isOpen]);

  const handleAddModul = useCallback(() => {
    setModuls((prev) => [...prev, { id: Date.now(), name: '' }]);
  }, []);

  const handleRemoveModul = useCallback((id: number) => {
    setModuls((prev) => prev.filter((modul) => modul.id !== id));
  }, []);

  const handleModulChange = useCallback((id: number, value: string) => {
    setModuls((prev) =>
      prev.map((modul) => (modul.id === id ? { ...modul, name: value } : modul))
    );
  }, []);

  const handleSubmit = useCallback(() => {
    // Filter out empty moduls before submitting if needed
    const validModuls = moduls.filter(m => m.name.trim() !== '');
    console.log('Submitting moduls:', validModuls);
    // Here you would typically call an API
    onClose();
  }, [moduls, onClose]);

  return {
    moduls,
    handleAddModul,
    handleRemoveModul,
    handleModulChange,
    handleSubmit,
  };
};
