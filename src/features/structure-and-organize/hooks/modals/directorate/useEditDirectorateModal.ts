import { useEffect, useState } from 'react';
import type { DirectorateListItem } from '../../../types/OrganizationApiTypes';
import { useFileStore } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';
import { useDirectorates } from '../../useDirectorates';

export function useEditDirectorateModal(
  isOpen: boolean,
  directorate?: DirectorateListItem | null,
  onClose?: () => void,
  onSuccess?: () => void
) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);
  const { updateDirectorate } = useDirectorates();

  useEffect(() => {
    if (isOpen && directorate) {
      setName(directorate.name || '');
      setDescription(directorate.description || '');
      setMemoNumber(directorate.memoNumber || '');
    }
  }, [isOpen, directorate]);

  const handleFileChange = (_e: React.ChangeEvent<HTMLInputElement>) => {};

  const handleSubmit = async () => {
    if (!directorate) return;
    setSubmitting(true);
    try {
      await updateDirectorate(directorate.id, {
        name,
        description,
        memoNumber,
        skFile: skFile?.file || null,
      });
      onSuccess?.();
      onClose?.();
    } catch {
      addNotification({
        variant: 'error',
        title: ' Direktorat tidak diupdate',
        description: 'Gagal mengupdate direktorat. Silakan coba lagi.',
        hideDuration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    name,
    setName,
    description,
    setDescription,
    memoNumber,
    setMemoNumber,
    skFile,
    submitting,
    handleSubmit,
    handleFileChange,
  };
}
