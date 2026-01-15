import { useState } from 'react';
import type { UnitRow } from '../../useUnits';
import { useFileStore } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';

type Args = {
  isOpen: boolean;
  onClose: () => void;
  unit?: UnitRow | null;
  onSuccess?: () => void;
};

export const useDeleteUnitModal = ({ isOpen, onClose, unit, onSuccess }: Args) => {
  const [submitting, setSubmitting] = useState(false);
  const skFile = useFileStore(s => s.skFile);

  const handleFileChange = (_e: React.ChangeEvent<HTMLInputElement>) => {};

  const handleDelete = async () => {
    if (!unit) return;
    if (!skFile?.file && !skFile?.name && !skFile?.path) {
      addNotification({
        variant: 'error',
        title: 'Unit tidak dihapus',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      return;
    }
    setSubmitting(true);
    try {
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to delete unit', err);
      addNotification({
        variant: 'error',
        title: 'Unit tidak dihapus',
        description: 'Gagal menghapus unit. Silakan coba lagi.',
        hideDuration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    skFile,
    handleFileChange,
    handleDelete,
  };
};

