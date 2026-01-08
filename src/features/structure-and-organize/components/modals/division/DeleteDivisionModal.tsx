import React from 'react';
import type { DivisionListItem } from '../../../types/OrganizationApiTypes';
import ModalDelete from '../../../../../components/shared/modal/ModalDelete';
import ModalDeleteContent from '../../../../../components/shared/modal/ModalDeleteContent';
import { useDeleteDivisionModal } from '../../../hooks/modals/division/useDeleteDivisionModal';

interface DeleteDivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  division?: DivisionListItem | null;
  onSuccess?: () => void;
}

const DeleteDivisionModal: React.FC<DeleteDivisionModalProps> = ({ isOpen, onClose, division, onSuccess }) => {
  const {
    memoNumber,
    setMemoNumber,
    skFileName,
    submitting,
    handleFileChange,
    handleDelete,
  } = useDeleteDivisionModal({ isOpen, onClose, division, onSuccess });

  return (
    <ModalDelete
      isOpen={isOpen}
      onClose={onClose}
      handleDelete={handleDelete}
      submitting={submitting}
      content={<ModalDeleteContent memoNumber={memoNumber} onMemoNumberChange={(e) => setMemoNumber(e.target.value)} skFileName={skFileName} onFileChange={handleFileChange} />}
      title="Hapus Data Divisi"
    />
  );
};

export default DeleteDivisionModal;
