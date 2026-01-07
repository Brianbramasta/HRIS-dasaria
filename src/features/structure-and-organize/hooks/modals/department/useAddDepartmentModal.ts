import { useEffect, useState } from 'react';
import type { DivisionDropdown } from '../../../types/OrganizationApiTypes';
import { useFileStore } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';
import { useDepartments } from '../../../hooks/useDepartments';
import { useDivisions } from '../../../hooks/useDivisions';

export function useAddDepartmentModal(params: { isOpen: boolean; onClose: () => void; onSuccess?: () => void }) {
  const { isOpen, onClose, onSuccess } = params;
  const [name, setName] = useState('');
  const [divisionId, setDivisionId] = useState('');
  const [description, setDescription] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [divisions, setDivisions] = useState<DivisionDropdown[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const { createDepartment } = useDepartments();
  const { getDropdown: getDivisionDropdown } = useDivisions();

  useEffect(() => {
    const loadDivisions = async () => {
      try {
        const res = await getDivisionDropdown('');
        setDivisions(res || []);
      } catch {}
    };
    if (isOpen) loadDivisions();
  }, [isOpen, getDivisionDropdown]);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDivisionId('');
      setDescription('');
      setMemoNumber('');
      useFileStore.getState().clearSkFile();
    }
  }, [isOpen]);

  const handleFileChange = () => {};

  const handleSubmit = async () => {
    setSubmitting(true);
    if (!skFile?.file) {
      addNotification({
        variant: 'error',
        title: 'Surat Keputusan tidak ditambahkan',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      setSubmitting(false);
      return;
    }
    try {
      await createDepartment({
        name,
        divisionId,
        description: description || null,
        memoNumber,
        skFile: skFile?.file as File,
      });
      onSuccess?.();
      onClose();
    } catch {
      addNotification({
        variant: 'error',
        title: 'Departemen tidak ditambahkan',
        description: 'Gagal menambahkan departemen. Silakan coba lagi.',
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
    divisionId,
    setDivisionId,
    description,
    setDescription,
    memoNumber,
    setMemoNumber,
    divisions,
    submitting,
    handleSubmit,
    skFileName,
    handleFileChange,
  };
}
