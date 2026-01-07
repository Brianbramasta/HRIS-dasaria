import React from 'react';
import type { CompanyListItem } from '../../../types/OrganizationApiTypes';
import ModalDelete from '../../../../../components/shared/modal/ModalDelete';
import ModalDeleteContent from '../../../../../components/shared/modal/ModalDeleteContent';
import { useDeleteCompanyModal } from '../../../hooks/modals/company/useDeleteCompanyModal';



interface DeleteCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company?: CompanyListItem | null;
  onSuccess?: () => void;
}

const DeleteCompanyModal: React.FC<DeleteCompanyModalProps> = ({ isOpen, onClose, company, onSuccess }) => {
  const { submitting, memoNumber, setMemoNumber, handleFileChange, handleDelete, skFileName } = useDeleteCompanyModal({
    isOpen,
    onClose,
    company,
    onSuccess,
  });

  return (
    
    <ModalDelete 
      isOpen={isOpen}
      onClose={onClose}
      handleDelete={handleDelete}
      submitting={submitting}
      content={<ModalDeleteContent memoNumber={memoNumber} onMemoNumberChange={(e) => setMemoNumber(e.target.value)} memoNumberReadOnly={false} skFileName={skFileName} onFileChange={handleFileChange} />}
      title="Hapus Data Perusahaan"
    />
  );
};

export default DeleteCompanyModal;
