import React from 'react';
import BaseContractModal, { type ContractEntry } from './BaseModal';
import { useModalContract } from '@/features/employee/hooks/employee-data/detail/contract/useModalContract';

interface AddContractModalProps {
  isOpen: boolean;
  initialData?: ContractEntry | null;
  onClose: () => void;
  onSubmit: (data: ContractEntry) => void;
  submitting?: boolean;
  onFileChange?: (file: File | null) => void;
}

const AddContractModal: React.FC<AddContractModalProps> = ({
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
  });

  const handleFileChangeWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = handleFileChange(e, 'fileName');
    onFileChange?.(file);
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <BaseContractModal
      isOpen={isOpen}
      title="Tambah Kontrak"
      form={form}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitting={submitting}
      isReadonly={false}
      optionsContractStatus={optionsContractStatus}
      optionsContractEndStatus={optionsContractEndStatus}
      onInputChange={handleInput}
      onDateChange={handleDateChange}
      onFileChange={handleFileChangeWrapper}
      showStatusBerakhir={false}
      isLoading={isLoadingDropdowns}
    />
  );
};

export default AddContractModal;
