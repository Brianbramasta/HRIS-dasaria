import { useState } from 'react';
import type { PositionListItem } from '../../../types/OrganizationApiTypes';
import { useFileStore } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';
import { usePositions } from '../../../hooks/useJobTitle';

interface UseDeletePositionModalParams {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  position: PositionListItem | null;
}

export function useDeletePositionModal({
  onClose,
  onSuccess,
  position,
}: UseDeletePositionModalParams) {
  const [memoNumber, setMemoNumber] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);
  const { deletePosition } = usePositions();

  const handleFileChange = () => {};

  const handleDelete = async () => {
    if (!position) return;
    if (!skFile?.file) {
      addNotification({
        variant: 'error',
        title: 'Jabatan tidak dihapus',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      return;
    }

    setSubmitting(true);
    try {
      await deletePosition(position.id, { memoNumber: memoNumber.trim(), skFile: skFile?.file });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to delete position:', error);
      addNotification({
        variant: 'error',
        title: 'Jabatan tidak dihapus',
        description: 'Gagal menghapus jabatan. Silakan coba lagi.',
        hideDuration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    memoNumber,
    setMemoNumber,
    skFile,
    submitting,
    handleFileChange,
    handleDelete,
  };
}

