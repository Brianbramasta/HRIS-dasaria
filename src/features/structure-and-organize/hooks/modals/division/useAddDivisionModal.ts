import { useEffect, useState } from 'react';
import type { DirectorateDropdown } from '../../../types/OrganizationApiTypes';
import { useFileStore } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';
import { useDivisions } from '../../../hooks/useDivisions';
import { useDirectorates } from '../../../hooks/useDirectorates';

export function useAddDivisionModal(params: { isOpen: boolean; onClose: () => void; onSuccess?: () => void }) {
  const { isOpen, onClose, onSuccess } = params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [directorateId, setDirectorateId] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [directorates, setDirectorates] = useState<DirectorateDropdown[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const { createDivision } = useDivisions();
  const { getDropdown: getDirectorateDropdown } = useDirectorates();

  useEffect(() => {
    const loadDirectorates = async () => {
      try {
        const res = await getDirectorateDropdown('');
        setDirectorates(res || []);
      } catch {}
    };
    if (isOpen) loadDirectorates();
  }, [isOpen, getDirectorateDropdown]);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDescription('');
      setDirectorateId('');
      setMemoNumber('');
      useFileStore.getState().clearSkFile();
    }
  }, [isOpen]);

  const handleFileChange = () => {};

  const handleSubmit = async () => {
    if (!skFile?.file) {
      addNotification({
        variant: 'error',
        title: 'Divisi tidak ditambahkan',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      return;
    }
    setSubmitting(true);
    try {
      await createDivision({
        name,
        directorateId,
        description: description || null,
        memoNumber,
        skFile: skFile.file as File,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      addNotification({
        variant: 'error',
        title: 'Divisi tidak ditambahkan',
        description: 'Gagal menambahkan divisi. Silakan coba lagi.',
        hideDuration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const skFileName = skFile?.name || '';

  return {
    name,
    setName,
    description,
    setDescription,
    directorateId,
    setDirectorateId,
    memoNumber,
    setMemoNumber,
    directorates,
    submitting,
    handleSubmit,
    handleFileChange,
    skFileName,
  };
}
