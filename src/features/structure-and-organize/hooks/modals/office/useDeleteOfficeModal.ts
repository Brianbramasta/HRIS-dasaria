import { useState } from 'react';
import type { OfficeListItem } from '../../../types/OrganizationApiTypes';
import { addNotification } from '@/stores/notificationStore';
import { useFileStore } from '@/stores/fileStore';
import { useOffices } from '../../../hooks/useOffices';

export function useDeleteOfficeModal(onClose: () => void, office?: OfficeListItem | null, onSuccess?: () => void) {
  const [memoNumber, setMemoNumber] = useState('');
  const [skFileName, setSkFileName] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);
  const { deleteOffice } = useOffices();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFileName(file?.name || '');
  };

  const handleDelete = async () => {
    if (!office) return;
    if (!skFile?.file) {
      addNotification({
        variant: 'error',
        title: 'Office tidak ditambahkan',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      return;
    }
    setSubmitting(true);
    try {
      await deleteOffice(office.id, {
        memoNumber: memoNumber.trim(),
        skFile: skFile.file as File,
      });
      onSuccess?.();
      onClose();
    } catch {
      addNotification({
        variant: 'error',
        title: 'Office tidak dihapus',
        description: 'Gagal menghapus office. Silakan coba lagi.',
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
    handleFileChange,
    submitting,
    handleDelete,
  };
}
