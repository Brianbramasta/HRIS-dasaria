import { useEffect, useState } from 'react';
import { useFileStore } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';
import { useDirectorates } from '../../useDirectorates';

export function useAddDirectorateModal(isOpen: boolean, onClose: () => void, onSuccess?: () => void) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);
  const { createDirectorate } = useDirectorates();

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDescription('');
      setMemoNumber('');
      useFileStore.getState().clearSkFile();
    }
  }, [isOpen]);

  const handleFileChange = (_e: React.ChangeEvent<HTMLInputElement>) => {};

  const handleSubmit = async () => {
    if (!skFile?.name) {
      addNotification({
        variant: 'error',
        title: 'Surat Keputusan tidak ditambahkan',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      setSubmitting(false);
      return;
    }
    setSubmitting(true);
    try {
      await createDirectorate({
        name,
        description: description || null,
        memoNumber,
        skFile: skFile?.file || undefined,
      });
      onSuccess?.();
      onClose();
    } catch {
      addNotification({
        variant: 'error',
        title: ' Direktorat tidak ditambahkan',
        description: 'Gagal menambahkan direktorat. Silakan coba lagi.',
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
