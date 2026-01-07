import { useState } from 'react';
import type { DepartmentListItem } from '../../../types/OrganizationApiTypes';
import { addNotification } from '@/stores/notificationStore';
import { useDepartments } from '../../../hooks/useDepartments';

export function useDeleteDepartmentModal(params: {
  isOpen: boolean;
  onClose: () => void;
  department?: DepartmentListItem | null;
  onSuccess?: () => void;
}) {
  const { onClose, department, onSuccess } = params;
  const [memoNumber, setMemoNumber] = useState('');
  const [skFileName, setSkFileName] = useState('');
  const [skFile, setSkFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { deleteDepartment } = useDepartments();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFileName(file?.name || '');
    setSkFile(file);
  };

  const handleDelete = async () => {
    if (!department) return;
    if (!skFile) {
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
      await deleteDepartment(department.id, { memoNumber: memoNumber.trim(), skFile });
      onSuccess?.();
      onClose();
    } catch {
      addNotification({
        variant: 'error',
        title: 'Departemen tidak dihapus',
        description: 'Gagal menghapus departemen. Silakan coba lagi.',
        hideDuration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    memoNumber,
    setMemoNumber,
    skFileName,
    submitting,
    handleFileChange,
    handleDelete,
  };
}
