import { useState } from 'react';
import { BusinessLineListItem } from '../../../types/OrganizationApiTypes';
import { useFileStore } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';
import { businessLinesService } from '../../../services/request/BusinessLinesService';

type Args = {
  onClose: () => void;
  onSuccess?: (created: BusinessLineListItem) => void;
};

export const useAddBusinessLineModal = ({ onClose, onSuccess }: Args) => {
  const [name, setName] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [description, setDescription] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (_e: React.ChangeEvent<HTMLInputElement>) => {};

  const handleSubmit = async () => {
    if (!name.trim()) return;
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
      formData.append('bl_name', name.trim());
      formData.append('bl_decree_number', memoNumber.trim());
      if (description.trim()) {
        formData.append('bl_description', description.trim());
      }
      formData.append('bl_decree_file', skFile.file);

      const created = await businessLinesService.create(formData);
      const item = (created as any)?.data ?? created;
      onSuccess?.(item as BusinessLineListItem);
      onClose();
      setName('');
      setMemoNumber('');
      setDescription('');
      useFileStore.getState().clearSkFile();
    } catch (err) {
      addNotification({
        variant: 'error',
        title: 'Lini Bisnis tidak ditambahkan',
        description: 'Gagal menambahkan lini bisnis. Silakan coba lagi.',
        hideDuration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    name,
    setName,
    memoNumber,
    setMemoNumber,
    description,
    setDescription,
    skFile,
    submitting,
    handleFileChange,
    handleSubmit,
  };
};
