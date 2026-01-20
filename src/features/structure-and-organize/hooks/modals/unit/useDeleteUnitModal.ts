import { useState, useEffect } from 'react';
import type { UnitRow } from '../../useUnits';
import { useFileStore } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';
import { useDeleteUnit } from '../../api/useApiUnits';

type Args = {
  isOpen: boolean;
  onClose: () => void;
  unit?: UnitRow | null;
  onSuccess?: () => void;
};

export const useDeleteUnitModal = ({ isOpen, onClose, unit, onSuccess }: Args) => {
  const [memoNumber, setMemoNumber] = useState('');
  
  const { execute: deleteUnit, loading: submitting } = useDeleteUnit();
  
  const skFile = useFileStore(s => s.skFile);
  const setSkFile = useFileStore(s => s.setSkFile);
  const clearSkFile = useFileStore(s => s.clearSkFile);

  useEffect(() => {
    if (isOpen) {
        clearSkFile();
        setMemoNumber('');
    }
  }, [isOpen, clearSkFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSkFile({
        name: file.name,
        path: URL.createObjectURL(file),
        size: file.size,
        type: file.type,
        file: file
      });
    }
  };

  const handleDelete = async () => {
    if (!unit?.id) return;
    
    if (!memoNumber.trim() || !skFile?.file) {
      addNotification({
        variant: 'error',
        title: 'Unit tidak dihapus',
        description: 'No. SK/Memo dan File Wajib di isi',
        hideDuration: 4000,
      });
      return;
    }
    
    try {
      await deleteUnit(unit.id, {
          memoNumber,
          skFile: skFile.file
      });

      addNotification({
        variant: 'success',
        title: 'Berhasil',
        description: 'Unit berhasil dihapus',
        hideDuration: 4000,
      });
      
      onSuccess?.();
      onClose();
    } catch {
      // Error handled by hook
    }
  };

  return {
    submitting,
    skFile,
    memoNumber,
    setMemoNumber,
    handleFileChange,
    handleDelete,
  };
};
