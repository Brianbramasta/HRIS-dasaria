import { useState } from 'react';
import { useFileStore } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';
import { usePositions } from '../../../hooks/useJobTitle';

interface UseAddPositionModalParams {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function useAddPositionModal({ isOpen, onClose, onSuccess }: UseAddPositionModalParams) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [directSubordinates, setDirectSubordinates] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);
  const { createPosition } = usePositions();

  const handleFileChange = () => {};

  const handleSubmit = async () => {
    if (!skFile?.file) {
      addNotification({
        variant: 'error',
        title: 'Jabatan tidak ditambahkan',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        grade: grade.trim() || null,
        jobDescription: jobDescription.trim() || null,
        directSubordinates: directSubordinates
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        memoNumber: memoNumber.trim(),
        skFile: skFile?.file as File,
      };
      await createPosition(payload);
      onSuccess?.();
      setName('');
      setGrade('');
      setDirectSubordinates('');
      setMemoNumber('');
      setJobDescription('');
      onClose();
    } catch (error) {
      console.error('Failed to add position:', error);
      addNotification({
        variant: 'error',
        title: 'Jabatan tidak ditambahkan',
        description: 'Gagal menambahkan jabatan. Silakan coba lagi.',
        hideDuration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    name,
    setName,
    grade,
    setGrade,
    directSubordinates,
    setDirectSubordinates,
    memoNumber,
    setMemoNumber,
    jobDescription,
    setJobDescription,
    skFile,
    submitting,
    handleFileChange,
    handleSubmit,
  };
}

