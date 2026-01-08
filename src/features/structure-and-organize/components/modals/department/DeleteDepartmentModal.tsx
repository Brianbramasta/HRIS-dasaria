import React from 'react';
import type { DepartmentListItem } from '../../../types/OrganizationApiTypes';
import ModalDelete from '../../../../../components/shared/modal/ModalDelete';
import ModalDeleteContent from '../../../../../components/shared/modal/ModalDeleteContent';
import { useDeleteDepartmentModal } from '../../../hooks/modals/department/useDeleteDepartmentModal';

interface DeleteDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department?: DepartmentListItem | null;
  onSuccess?: () => void;
}

const DeleteDepartmentModal: React.FC<DeleteDepartmentModalProps> = ({ isOpen, onClose, department, onSuccess }) => {
  const { memoNumber, setMemoNumber, skFileName, submitting, handleFileChange, handleDelete } =
    useDeleteDepartmentModal({ isOpen, onClose, department, onSuccess });

  return (
    <ModalDelete
      isOpen={isOpen}
      onClose={onClose}
      handleDelete={handleDelete}
      submitting={submitting}
      content={<ModalDeleteContent memoNumber={memoNumber} onMemoNumberChange={(e) => setMemoNumber(e.target.value)} skFileName={skFileName} onFileChange={handleFileChange} />}
      title="Hapus Data Departemen"
    />
  );
};

export default DeleteDepartmentModal;
