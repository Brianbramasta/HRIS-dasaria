import React from 'react';
import ModalDelete from '../../../../../../components/shared/modal/ModalDelete';
import ModalDeleteContent from '../../../../../../components/shared/modal/ModalDeleteContent';
import { useDeleteDocumentModal } from '../../../../hooks/modals/company/detail/useDeleteDocumentModal';

interface DeleteDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: any | null;
  companyId?: string;
  onSuccess?: () => void;
}

const DeleteDocumentModal: React.FC<DeleteDocumentModalProps> = ({ isOpen, onClose, document, companyId, onSuccess }) => {
  const { submitting, memoNumber, setMemoNumber, skFileName, handleFileChange, handleDelete } = useDeleteDocumentModal({
    isOpen,
    onClose,
    document,
    companyId,
    onSuccess,
  });

  return (
   
    <ModalDelete
      isOpen={isOpen}
      onClose={onClose}
      handleDelete={handleDelete}
      submitting={submitting}
      content={
        <ModalDeleteContent
          memoNumber={memoNumber}
          memoNumberReadOnly={false}
          onMemoNumberChange={(e) => setMemoNumber(e.target.value)}
          skFileName={skFileName}
          onFileChange={handleFileChange}
        />
      }
    />
  );
};

export default DeleteDocumentModal;
