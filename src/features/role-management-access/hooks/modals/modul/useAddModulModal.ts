import { useState, useCallback, useEffect } from 'react';
import { useApiModules } from '../../api/useApiModules';

export interface ModulItem {
  id: number;
  name: string;
}

export const useAddModulModal = (
  isOpen: boolean, 
  onClose: () => void,
  appsId?: string,
  onSuccess?: () => void
) => {
  const [moduls, setModuls] = useState<ModulItem[]>([{ id: Date.now(), name: '' }]);
  const { createModule, loading } = useApiModules();

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

  const handleSubmit = useCallback(async () => {
    if (!appsId) {
      console.error('Apps ID is missing');
      return;
    }

    // Filter out empty moduls before submitting
    const validModulNames = moduls
      .map(m => m.name.trim())
      .filter(name => name !== '');
      
    if (validModulNames.length === 0) {
      return;
    }

    const success = await createModule({
      apps_id: appsId,
      name: validModulNames
    });

    if (success) {
      onSuccess?.();
      onClose();
    }
  }, [moduls, appsId, createModule, onSuccess, onClose]);

  return {
    moduls,
    handleAddModul,
    handleRemoveModul,
    handleModulChange,
    handleSubmit,
    loading,
  };
};
