import { useEffect, useState } from 'react';
import { businessLinesService } from '../../../services/request/BusinessLinesService';
import { BusinessLineListItem } from '../../../types/OrganizationApiTypes';
import { useFileStore } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';

type Args = {
  businessLine?: BusinessLineListItem | null;
  onClose: () => void;
  onSuccess?: (updated: BusinessLineListItem) => void;
};

export const useEditBusinessLineModal = ({ businessLine, onClose, onSuccess }: Args) => {
  const [name, setName] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [description, setDescription] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (businessLine) {
      setName(businessLine.name || '');
      setMemoNumber(businessLine.memoNumber || '');
      setDescription(businessLine.description || '');
    }
  }, [businessLine]);

  const handleFileChange = (_e: React.ChangeEvent<HTMLInputElement>) => {};

  const handleSubmit = async () => {
    if (!businessLine) return;
    setSubmitting(true);
    try {
      const updated = await businessLinesService.update(businessLine.id, {
        name: name.trim(),
        description: description.trim() || null,
        memoNumber: memoNumber.trim(),
        skFile: skFile?.file || null,
      });
      onSuccess?.(updated);
      onClose();
    } catch (err) {
      addNotification({
        variant: 'error',
        title: 'Lini Bisnis tidak diupdate',
        description: 'Gagal mengupdate lini bisnis. Silakan coba lagi.',
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
