import { useState } from 'react';
import type { EmployeePositionListItem } from '../../../types/OrganizationApiTypes';
import { useFileStore } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';
import { useEmployeePositions } from '../../../hooks/useEmployeePositions';

interface UseDeleteEmployeePositionModalParams {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (id: string) => void;
  employeePosition: EmployeePositionListItem | null;
}

export function useDeleteEmployeePositionModal({
  onClose,
  onSuccess,
  employeePosition,
}: UseDeleteEmployeePositionModalParams) {
  const [memoNumber, setMemoNumber] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);
  const { deleteEmployeePosition } = useEmployeePositions();

  const handleFileChange = () => {};

  const handleDelete = async () => {
    if (!employeePosition) return;
    if (!skFile?.name) {
      addNotification({
        variant: 'error',
        title: 'Posisi Pegawai tidak dihapus',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      setSubmitting(false);
      return;
    }
    setSubmitting(true);
    try {
      await deleteEmployeePosition(employeePosition.id, { memoNumber: memoNumber.trim(), skFileId: skFile?.path || skFile?.name });
      onSuccess?.(employeePosition.id);
      onClose();
    } catch (err) {
      console.error('Failed to delete employee position', err);
      addNotification({
        variant: 'error',
        title: 'Posisi Pegawai tidak dihapus',
        description: 'Gagal menghapus posisi pegawai. Silakan coba lagi.',
        hideDuration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    memoNumber,
    setMemoNumber,
    skFile,
    submitting,
    handleFileChange,
    handleDelete,
  };
}

