import React from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { businessLinesService } from '../../../services/request/businessLines.service';
import { BusinessLineListItem } from '../../../types/organization.api.types';
import ModalDelete from '../shared/modal/ModalDelete';
import ModalDeleteContent from '../shared/modal/ModalDeleteContent';
import { addNotification } from '@/stores/notificationStore';

interface DeleteBusinessLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessLine?: BusinessLineListItem | null;
  onSuccess?: () => void;
}

const DeleteBusinessLineModal: React.FC<DeleteBusinessLineModalProps> = ({ isOpen, onClose, businessLine, onSuccess }) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [skFileName, setSkFileName] = React.useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFileName(file?.name || '');
  };
  

  const handleDelete = async () => {
    if (!businessLine) return;
    if (!skFileName) {
      addNotification({
        variant: 'error',
        title: 'Lini Bisnis tidak ditambahkan',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      return};
    setSubmitting(true);
    try {
      await businessLinesService.delete(businessLine.id, {
        memoNumber: businessLine.memoNumber || '',
        skFileId: skFileName,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to delete business line', err);
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
          memoNumber={businessLine?.memoNumber || ''}
          memoNumberReadOnly={true}
          skFileName={skFileName}
          onFileChange={handleFileChange}
          
        />
      }
      title="Hapus Data Lini Bisnis"
      />
  );
};

export default DeleteBusinessLineModal;
