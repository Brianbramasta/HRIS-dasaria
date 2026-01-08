import React from 'react';
import type { DirectorateListItem } from '../../../types/OrganizationApiTypes';
import ModalDelete from '../../../../../components/shared/modal/ModalDelete';
import ModalDeleteContent from '../../../../../components/shared/modal/ModalDeleteContent';
import { useDeleteDirectorateModal } from '../../../hooks/modals/directorate/useDeleteDirectorateModal';

interface DeleteDirectorateModalProps {
  isOpen: boolean;
  onClose: () => void;
  directorate?: DirectorateListItem | null;
  onSuccess?: () => void;
}

const DeleteDirectorateModal: React.FC<DeleteDirectorateModalProps> = ({ isOpen, onClose, directorate, onSuccess }) => {
  const {
    memoNumber,
    setMemoNumber,
    skFileName,
    handleFileChange,
    submitting,
    handleDelete,
  } = useDeleteDirectorateModal(directorate, onClose, onSuccess);

  return (
    <ModalDelete
      isOpen={isOpen}
      onClose={onClose}
      handleDelete={handleDelete}
      submitting={submitting}
      content={<ModalDeleteContent memoNumber={memoNumber} onMemoNumberChange={(e) => setMemoNumber(e.target.value)} skFileName={skFileName} onFileChange={handleFileChange} />}
      title="Hapus Data Direktorat"
    />
  );
};

export default DeleteDirectorateModal;
