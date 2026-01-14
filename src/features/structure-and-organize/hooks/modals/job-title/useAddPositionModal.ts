import { useState } from 'react';
import { useFileStore } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';
import { usePositions } from '../../../hooks/useJobTitle';

interface UseAddPositionModalParams {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function useAddPositionModal({ onClose, onSuccess }: UseAddPositionModalParams) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [structuralPositions, setStructuralPositions] = useState<string[]>(['']);
  const [memoNumber, setMemoNumber] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);
  const { createPosition } = usePositions();

  const handleFileChange = () => {};

  const handleSubmit = async () => {
    const cleanedStructural = structuralPositions.map((s) => s.trim()).filter(Boolean);
    if (cleanedStructural.length === 0) {
      addNotification({
        variant: 'error',
        title: 'Jabatan tidak ditambahkan',
        description: 'Jabatan Struktural wajib diisi minimal satu baris',
        hideDuration: 4000,
      });
      return;
    }
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
        structuralJobs: cleanedStructural,
        memoNumber: memoNumber.trim(),
        skFile: skFile?.file as File,
      };
      await createPosition(payload);
      onSuccess?.();
      setName('');
      setGrade('');
      setStructuralPositions(['']);
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

  const addStructuralRow = () => {
    setStructuralPositions((prev) => [...prev, '']);
  };

  const removeStructuralRow = (index: number) => {
    setStructuralPositions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateStructuralAt = (index: number, value: string) => {
    setStructuralPositions((prev) => prev.map((v, i) => (i === index ? value : v)));
  };

  return {
    name,
    setName,
    grade,
    setGrade,
    structuralPositions,
    addStructuralRow,
    removeStructuralRow,
    updateStructuralAt,
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

