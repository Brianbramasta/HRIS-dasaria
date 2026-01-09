import React from 'react';
import BaseContractModal, { type ContractEntry } from './BaseModal';
import { useAddContractModal } from '@/features/employee/hooks/modals/employee-data/contract/useAddContractModal';

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
    optionsJenisKontrak,
    isLoadingDropdowns,
    handleInput,
    handleDateChange,
    handleFileChangeWrapper,
    handleSubmit,
  } = useAddContractModal({
    isOpen,
    initialData,
    onSubmit,
    onFileChange,
  });

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
      optionsJenisKontrak={optionsJenisKontrak}
      onInputChange={handleInput}
      onDateChange={handleDateChange}
      onFileChange={handleFileChangeWrapper}
      showStatusBerakhir={false}
      isLoading={isLoadingDropdowns}
    />
  );
};

export default AddContractModal;
