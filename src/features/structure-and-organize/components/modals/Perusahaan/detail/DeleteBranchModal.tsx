import React from 'react';
import { officeService } from '../../../../services/organization.service';
import ModalDelete from '../../shared/modal/ModalDelete';
import ModalDeleteContent from '../../shared/modal/ModalDeleteContent';
import { addNotification } from '@/stores/notificationStore';

interface DeleteBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch?: any | null;
  onSuccess?: () => void;
}

const DeleteBranchModal: React.FC<DeleteBranchModalProps> = ({ isOpen, onClose, branch, onSuccess }) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [skFileName, setSkFileName] = React.useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFileName(file?.name || '');
  };

  const handleDelete = async () => {
    if (!branch) return;
    if (!skFileName) {
      addNotification({
        variant: 'error',
        title: 'Branch tidak dihapus',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      return;
    }
    setSubmitting(true);
    try {
      await officeService.delete(branch.id, { memoNumber: branch.memoNumber || '', skFileId: skFileName });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to delete branch', err);
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
          memoNumber={branch?.memoNumber || ''}
          memoNumberReadOnly={true}
          skFileName={skFileName}
          onFileChange={handleFileChange}
        />
      }
    />
  );
};

export default DeleteBranchModal;
