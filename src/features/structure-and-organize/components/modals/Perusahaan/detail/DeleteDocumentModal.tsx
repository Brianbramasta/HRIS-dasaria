import React from 'react';
import { apiService } from '../../../../../../services/api';
import ModalDelete from '../../shared/modal/ModalDelete';

interface DeleteDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: any | null;
  onSuccess?: () => void;
}

const DeleteDocumentModal: React.FC<DeleteDocumentModalProps> = ({ isOpen, onClose, document, onSuccess }) => {
  const [submitting, setSubmitting] = React.useState(false);

  const handleDelete = async () => {
    if (!document) return;
    setSubmitting(true);
    try {
      await apiService.delete(`/documents/${document.id}` as any);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to delete document', err);
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
        <p className='text-center'>Apakah anda yakin ingin menghapus dokumen <strong>{document?.name}</strong> ?</p>
      </>}
    />
  );
};

export default DeleteDocumentModal;
