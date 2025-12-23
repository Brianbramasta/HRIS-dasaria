import React, { useState } from 'react';
import type { DirectorateListItem } from '../../../types/OrganizationApiTypes';
import ModalDelete from '../../../../../components/shared/modal/ModalDelete';
import ModalDeleteContent from '../../../../../components/shared/modal/ModalDeleteContent';
import { addNotification } from '@/stores/notificationStore';
import { useFileStore } from '@/stores/fileStore';
import { useDirectorates } from '../../../hooks/useDirectorates';

interface DeleteDirectorateModalProps {
  isOpen: boolean;
  onClose: () => void;
  directorate?: DirectorateListItem | null;
  onSuccess?: () => void;
}

const DeleteDirectorateModal: React.FC<DeleteDirectorateModalProps> = ({ isOpen, onClose, directorate, onSuccess }) => {
  const [memoNumber, setMemoNumber] = useState('');
  const [skFileName, setSkFileName] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);
  const { deleteDirectorate } = useDirectorates();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFileName(file?.name || '');
  };

  const handleDelete = async () => {
    if (!directorate) return;
    if (!skFile?.file) {
          addNotification({
            variant: 'error',
            title: ' Direktorat tidak dihapus',
            description: 'File Wajib di isi',
            hideDuration: 4000,
          });
          return};
    setSubmitting(true);
    try {
      await deleteDirectorate(directorate.id, {
        memoNumber: memoNumber.trim(),
        skFile: skFile.file as File,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to delete directorate', err);
      addNotification({
        variant: 'error',
        title: ' Direktorat tidak dihapus',
        description: 'Gagal menghapus direktorat. Silakan coba lagi.',
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
      title="Hapus Data Direktorat"
    />
  );
};

export default DeleteDirectorateModal;
