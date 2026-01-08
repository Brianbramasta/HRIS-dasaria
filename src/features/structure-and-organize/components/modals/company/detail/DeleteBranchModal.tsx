import React from 'react';
import ModalDelete from '../../../../../../components/shared/modal/ModalDelete';
import ModalDeleteContent from '../../../../../../components/shared/modal/ModalDeleteContent';
import { useDeleteBranchModal } from '../../../../hooks/modals/company/detail/useDeleteBranchModal';

interface DeleteBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch?: any | null;
  onSuccess?: () => void;
}

const DeleteBranchModal: React.FC<DeleteBranchModalProps> = ({ isOpen, onClose, branch, onSuccess }) => {
  const { submitting, skFileName, handleFileChange, handleDelete } = useDeleteBranchModal({ isOpen, onClose, branch, onSuccess });

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
