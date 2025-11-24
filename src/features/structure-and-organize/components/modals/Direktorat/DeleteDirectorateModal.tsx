import React, { useState } from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { directoratesService } from '../../../services/request/directorates.service';
import type { DirectorateListItem } from '../../../types/organization.api.types';
import ModalDelete from '../shared/modal/ModalDelete';
import ModalDeleteContent from '../shared/modal/ModalDeleteContent';
import { addNotification } from '@/stores/notificationStore';

interface DeleteDirectorateModalProps {
  isOpen: boolean;
  onClose: () => void;
  directorate?: DirectorateListItem | null;
  onSuccess?: () => void;
}

const DeleteDirectorateModal: React.FC<DeleteDirectorateModalProps> = ({ isOpen, onClose, directorate, onSuccess }) => {
  const [memoNumber, setMemoNumber] = useState('');
  const [skFileName, setSkFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFileName(file?.name || '');
  };

  const handleDelete = async () => {
    if (!directorate) return;
    if (!skFileName) {
          addNotification({
            variant: 'error',
            title: ' Direktorat tidak dihapus',
            description: 'File Wajib di isi',
            hideDuration: 4000,
          });
          return};
    setSubmitting(true);
    try {
      await directoratesService.delete(directorate.id, {
        memoNumber: memoNumber.trim(),
        skFileId: skFileName,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to delete directorate', err);
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
