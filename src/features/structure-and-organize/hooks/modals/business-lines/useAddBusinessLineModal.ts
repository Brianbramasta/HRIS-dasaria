import { useState } from 'react';
import { businessLinesService } from '../../../services/request/BusinessLinesService';
import { BusinessLineListItem } from '../../../types/OrganizationApiTypes';
import { useFileStore } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';

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
      const created = await businessLinesService.create({
        name: name.trim(),
        description: description.trim() || null,
        memoNumber: memoNumber.trim(),
        skFile: skFile.file,
      });
      onSuccess?.(created);
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
