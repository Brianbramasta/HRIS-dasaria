import React from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { BusinessLineListItem } from '../../../types/OrganizationApiTypes';
import ModalDelete from '../../../../../components/shared/modal/ModalDelete';
import ModalDeleteContent from '../../../../../components/shared/modal/ModalDeleteContent';
import { useDeleteBusinessLineModal } from '../../../hooks/modals/business-lines/useDeleteBusinessLineModal';

interface DeleteBusinessLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessLine?: BusinessLineListItem | null;
  onSuccess?: () => void;
}

const DeleteBusinessLineModal: React.FC<DeleteBusinessLineModalProps> = ({ isOpen, onClose, businessLine, onSuccess }) => {
  const { submitting, skFile, handleFileChange, handleDelete } = useDeleteBusinessLineModal({
    businessLine,
    onClose,
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
          memoNumber={businessLine?.memoNumber || ''}
          memoNumberReadOnly={true}
          skFileName={skFile?.name || ''}
          onFileChange={handleFileChange}
          
        />
      }
      title="Hapus Data Lini Bisnis"
      />
  );
};

export default DeleteBusinessLineModal;
