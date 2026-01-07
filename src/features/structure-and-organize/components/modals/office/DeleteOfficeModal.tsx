import React from 'react';
import type { OfficeListItem } from '../../../types/OrganizationApiTypes';
import ModalDelete from '../../../../../components/shared/modal/ModalDelete';
import ModalDeleteContent from '../../../../../components/shared/modal/ModalDeleteContent';
import { useDeleteOfficeModal } from '../../../hooks/modals/office/useDeleteOfficeModal';


interface DeleteOfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
  office?: OfficeListItem | null;
  onSuccess?: () => void;
}

const DeleteOfficeModal: React.FC<DeleteOfficeModalProps> = ({ isOpen, onClose, office, onSuccess }) => {
  const { memoNumber, setMemoNumber, skFileName, handleFileChange, submitting, handleDelete } =
    useDeleteOfficeModal(onClose, office, onSuccess);

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
