import React from 'react';
import BaseContractModal, { type ContractEntry } from './BaseModal';
import { useModalContract } from '@/features/employee/hooks/employee-data/detail/contract/useModalContract';

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
    handleFileChange,
  } = useModalContract({
    isOpen,
    initialData,
    isEditable: true,
    isEditStatusBerakhir: true,
  });

  const handleFileChangeWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = handleFileChange(e, 'dokumenBerakhir');
    onFileChange?.(file);
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

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
