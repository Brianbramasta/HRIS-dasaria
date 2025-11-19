import React from 'react';
import { officeService } from '../../../../services/organization.service';
import ModalDelete from '../../shared/modal/ModalDelete';

interface DeleteBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch?: any | null;
  onSuccess?: () => void;
}

const DeleteBranchModal: React.FC<DeleteBranchModalProps> = ({ isOpen, onClose, branch, onSuccess }) => {
  const [submitting, setSubmitting] = React.useState(false);

  const handleDelete = async () => {
    if (!branch) return;
    setSubmitting(true);
    try {
      await officeService.delete(branch.id, { memoNumber: branch.memoNumber || '', skFileId: branch.skFile?.fileName || '' });
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
      content={<>
        <p className='text-center'>Apakah anda yakin ingin menghapus branch <strong>{branch?.name}</strong> ?</p>
      </>}
    />
  );
};

export default DeleteBranchModal;
