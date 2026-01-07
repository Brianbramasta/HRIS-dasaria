import { useState } from 'react';
import { businessLinesService } from '../../../services/request/BusinessLinesService';
import { BusinessLineListItem } from '../../../types/OrganizationApiTypes';
import { addNotification } from '@/stores/notificationStore';
import { useFileStore } from '@/stores/fileStore';

type Args = {
  businessLine?: BusinessLineListItem | null;
  onClose: () => void;
  onSuccess?: () => void;
};

export const useDeleteBusinessLineModal = ({ businessLine, onClose, onSuccess }: Args) => {
  const [submitting, setSubmitting] = useState(false);
  const skFile = useFileStore((s) => s.skFile);

  const handleFileChange = (_e: React.ChangeEvent<HTMLInputElement>) => {};

  const handleDelete = async () => {
    if (!businessLine) return;
    if (!skFile?.file) {
      addNotification({
        variant: 'error',
        title: 'Lini Bisnis tidak ditambahkan',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      return;
    }
    setSubmitting(true);
    try {
      await businessLinesService.delete(businessLine.id, {
        memoNumber: businessLine.memoNumber || '',
        skFile: skFile.file,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      addNotification({
        variant: 'error',
        title: 'Lini Bisnis tidak dihapus',
        description: 'Gagal menghapus lini bisnis. Silakan coba lagi.',
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
