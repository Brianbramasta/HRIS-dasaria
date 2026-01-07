import React from 'react';
import BaseContractModal, { type ContractEntry } from './BaseModal';
import { useEditContractModal } from '@/features/employee/hooks/modals/employee-data/contract/useEditContractModal';

interface EditContractModalProps {
  isOpen: boolean;
  initialData?: ContractEntry | null;
  onClose: () => void;
  onSubmit: (data: ContractEntry) => void;
  submitting?: boolean;
  onFileChange?: (file: File | null) => void;
}

const EditContractModal: React.FC<EditContractModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSubmit,
  submitting = false,
  onFileChange,
}) => {
  const {
    form,
    optionsContractStatus,
    optionsContractEndStatus,
    isLoadingDropdowns,
    handleInput,
    handleDateChange,
    handleFileChangeWrapper,
    handleSubmit,
  } = useEditContractModal({
    isOpen,
    initialData,
    onSubmit,
    onFileChange,
  });

  return (
    <BaseContractModal
      isOpen={isOpen}
      title="Edit Kontrak"
      form={form}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitting={submitting}
      isReadonly={true}
      optionsContractStatus={optionsContractStatus}
      optionsContractEndStatus={optionsContractEndStatus}
      onInputChange={handleInput}
      onDateChange={handleDateChange}
      onFileChange={handleFileChangeWrapper}
      showStatusBerakhir={true}
      isEditStatusBerakhir={true}
      isLoading={isLoadingDropdowns}
    />
  );
};

export default EditContractModal;
