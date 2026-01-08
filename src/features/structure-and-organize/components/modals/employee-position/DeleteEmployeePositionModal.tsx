import React from 'react';
import type { EmployeePositionListItem } from '../../../types/OrganizationApiTypes';
import ModalDelete from '../../../../../components/shared/modal/ModalDelete';
import ModalDeleteContent from '../../../../../components/shared/modal/ModalDeleteContent';
import { useDeleteEmployeePositionModal } from '../../../hooks/modals/employee-position/useDeleteEmployeePositionModal';

interface DeleteEmployeePositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (id: string) => void;
  employeePosition: EmployeePositionListItem | null;
}

const DeleteEmployeePositionModal: React.FC<DeleteEmployeePositionModalProps> = ({ isOpen, onClose, onSuccess, employeePosition }) => {
  const { memoNumber, setMemoNumber, skFile, submitting, handleFileChange, handleDelete } =
    useDeleteEmployeePositionModal({ isOpen, onClose, onSuccess, employeePosition });

  return (
    <ModalDelete
      isOpen={isOpen}
      onClose={onClose}
      content={<ModalDeleteContent memoNumber={memoNumber} onMemoNumberChange={(e) => setMemoNumber(e.target.value)} skFileName={skFile?.name || ''} onFileChange={handleFileChange} note={"*Data tidak benar-benar dihapus akan tetapi diarsipkan"} />}
      handleDelete={handleDelete}
      submitting={submitting}
      title="Hapus Data Posisi Pegawai"
    />
  );
};

export default DeleteEmployeePositionModal;
