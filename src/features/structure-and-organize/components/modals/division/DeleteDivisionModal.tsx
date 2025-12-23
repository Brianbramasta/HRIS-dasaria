import React, { useState } from 'react';
import type { DivisionListItem } from '../../../types/OrganizationApiTypes';
import ModalDelete from '../../../../../components/shared/modal/ModalDelete';
import ModalDeleteContent from '../../../../../components/shared/modal/ModalDeleteContent';
import { addNotification } from '@/stores/notificationStore';
import { useFileStore } from '@/stores/fileStore';
import { useDivisions } from '../../../hooks/useDivisions';

interface DeleteDivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  division?: DivisionListItem | null;
  onSuccess?: () => void;
}

const DeleteDivisionModal: React.FC<DeleteDivisionModalProps> = ({ isOpen, onClose, division, onSuccess }) => {
  const [memoNumber, setMemoNumber] = useState('');
  const [skFileName, setSkFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const skFileMeta = useFileStore((s) => s.skFile);
  const { deleteDivision } = useDivisions();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFileName(file?.name || '');
  };

  const handleDelete = async () => {
    if (!division) return;
    if (!skFileMeta?.file) {
          addNotification({
            variant: 'error',
            title: 'Divisi tidak dihapus',
            description: 'File Wajib di isi',
            hideDuration: 4000,
          });
          return};
    setSubmitting(true);
    try {
      await deleteDivision(division.id, { memoNumber: memoNumber.trim(), skFile: skFileMeta.file as File });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to delete division', err);
      addNotification({
        variant: 'error',
        title: 'Divisi tidak dihapus',
        description: 'Gagal menghapus divisi. Silakan coba lagi.',
        hideDuration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalDelete
      isOpen={isOpen}
      onClose={onClose}
      handleDelete={handleDelete}
      submitting={submitting}
      content={<ModalDeleteContent memoNumber={memoNumber} onMemoNumberChange={(e) => setMemoNumber(e.target.value)} skFileName={skFileName} onFileChange={handleFileChange} />}
      title="Hapus Data Divisi"
    />
  );
};

export default DeleteDivisionModal;
