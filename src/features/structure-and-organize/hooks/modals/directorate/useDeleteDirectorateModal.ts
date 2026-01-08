import { useState } from 'react';
import type { DirectorateListItem } from '../../../types/OrganizationApiTypes';
import { addNotification } from '@/stores/notificationStore';
import { useFileStore } from '@/stores/fileStore';
import { useDirectorates } from '../../useDirectorates';

export function useDeleteDirectorateModal(
  directorate?: DirectorateListItem | null,
  onClose?: () => void,
  onSuccess?: () => void
) {
  const [memoNumber, setMemoNumber] = useState('');
  const [skFileName, setSkFileName] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);
  const { deleteDirectorate } = useDirectorates();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFileName(file?.name || '');
  };

  const handleDelete = async () => {
    if (!directorate) return;
    if (!skFile?.file) {
      addNotification({
        variant: 'error',
        title: ' Direktorat tidak dihapus',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      return;
    }
    setSubmitting(true);
    try {
      await deleteDirectorate(directorate.id, {
        memoNumber: memoNumber.trim(),
        skFile: skFile.file as File,
      });
      onSuccess?.();
      onClose?.();
    } catch {
      addNotification({
        variant: 'error',
        title: ' Direktorat tidak dihapus',
        description: 'Gagal menghapus direktorat. Silakan coba lagi.',
        hideDuration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    memoNumber,
    setMemoNumber,
    skFileName,
    setSkFileName,
    skFile,
    submitting,
    handleDelete,
    handleFileChange,
  };
}
