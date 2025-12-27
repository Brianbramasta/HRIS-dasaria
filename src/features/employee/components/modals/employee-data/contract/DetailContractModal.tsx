import React from 'react';
import BaseContractModal, { type ContractEntry } from './BaseModal';
import { useModalContract } from '@/features/employee/hooks/employee-data/detail/contract/useModalContract';

interface DetailContractModalProps {
  isOpen: boolean;
  initialData?: ContractEntry | null;
  onClose: () => void;
}

const DetailContractModal: React.FC<DetailContractModalProps> = ({
  isOpen,
  initialData,
  onClose,
}) => {
  const {
    form,
    optionsContractStatus,
    optionsContractEndStatus,
    isLoadingDropdowns,
  } = useModalContract({
    isOpen,
    initialData,
    isEditable: false,
  });

  const handleInput = () => {
    // Read-only mode, do nothing
  };

  const handleDateChange = () => () => {
    // Read-only mode, do nothing
  };

  const handleSubmit = () => {
    // Read-only mode, do nothing
  };

  return (
    <BaseContractModal
      isOpen={isOpen}
      title="Detail Kontrak"
      form={form}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitting={false}
      isReadonly={true}
      optionsContractStatus={optionsContractStatus}
      optionsContractEndStatus={optionsContractEndStatus}
      onInputChange={handleInput}
      onDateChange={handleDateChange}
      showStatusBerakhir={true}
      isLoading={isLoadingDropdowns}
    />
  );
};

export default DetailContractModal;
