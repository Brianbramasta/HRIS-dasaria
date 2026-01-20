import { useState } from 'react';
import { BusinessLineListItem } from '../../../types/OrganizationApiTypes';
import { addNotification } from '@/stores/notificationStore';
import { useFileStore } from '@/stores/fileStore';
import { businessLinesService } from '../../../services/request/BusinessLinesService';

type Args = {
  businessLine?: BusinessLineListItem | null;
  onClose: () => void;
  onSuccess?: () => void;
};

export const useDeleteBusinessLineModal = ({ businessLine, onClose, onSuccess }: Args) => {
  const [submitting, setSubmitting] = useState(false);
  const skFile = useFileStore((s) => s.skFile);

  const handleFileChange = () => {};

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
      const formData = new FormData();
      formData.append('_method', 'DELETE');
      if (businessLine.memoNumber) {
        formData.append('bl_delete_decree_number', businessLine.memoNumber);
      }
      formData.append('bl_delete_decree_file', skFile.file);

      await businessLinesService.delete(businessLine.id, formData);
      onSuccess?.();
      onClose();
    } catch {
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
