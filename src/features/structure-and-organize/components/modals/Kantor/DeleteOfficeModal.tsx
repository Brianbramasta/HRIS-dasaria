import React, { useState } from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { officesService } from '../../../services/request/offices.service';
import type { OfficeListItem } from '../../../types/organization.api.types';
import ModalDelete from '../shared/modal/ModalDelete';
import ModalDeleteContent from '../shared/modal/ModalDeleteContent';
import { addNotification } from '@/stores/notificationStore';


interface DeleteOfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
  office?: OfficeListItem | null;
  onSuccess?: () => void;
}

const DeleteOfficeModal: React.FC<DeleteOfficeModalProps> = ({ isOpen, onClose, office, onSuccess }) => {
  const [memoNumber, setMemoNumber] = useState('');
  const [skFileName, setSkFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFileName(file?.name || '');
  };

  const handleDelete = async () => {
    if (!office) return;
    if (!skFileName){
          addNotification({
            variant: 'error',
            title: 'Office tidak ditambahkan',
            description: 'File Wajib di isi',
            hideDuration: 4000,
          });
          return;
        }
    setSubmitting(true);
    try {
      await officesService.delete(office.id, {
        memoNumber: memoNumber.trim(),
        skFileId: skFileName,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to delete office', err);
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
      content={
        <ModalDeleteContent
          memoNumber={memoNumber}
          onMemoNumberChange={(e) => setMemoNumber(e.target.value)}
          skFileName={skFileName}
          onFileChange={handleFileChange}
        />
      }
      title="Hapus Data Kantor"
    />
  );
};

export default DeleteOfficeModal;
