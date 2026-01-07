import React from 'react';
import BaseContractModal, { type ContractEntry } from './BaseModal';
import { useDetailContractModal } from '@/features/employee/hooks/modals/contract/useDetailContractModal';

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
    handleInput,
    handleDateChange,
    handleSubmit,
  } = useDetailContractModal({
    isOpen,
    initialData,
  });

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
